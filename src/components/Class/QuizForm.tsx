import { useState, MouseEvent } from 'react';
import { storage, ref, uploadBytes, getDownloadURL } from "../../firebase/firebase";
import imageCompression from 'browser-image-compression';
import { doCreateQuiz } from '../../api/functions';
import { useAuth } from '../../hooks/authContext';
import { toast } from 'react-toastify';
import CustomToast from "../Toast/CustomToast";
import { motion } from 'framer-motion';
import { ChevronLeft, Book, CaseSensitive, Shield, PlusCircle, CheckCircle2, Image, ImagePlus } from 'lucide-react';
import { SpinLoadingColored } from '../Icons/icons';
import { useAutoHideScrollbar } from '../../utils/helpers';

interface Question {
  type: string;
  question: string;
  options: string[];
  answer: number;
  answers: string[];
  image: string | null;
  imageFile: File | null;
}

const CATEGORY_LIST = [
    { name: "Pagpabasa", icon: <Book size={28} /> },
    { name: "Gramatika", icon: <CaseSensitive size={28} /> },
    { name: "Pagpapahalaga", icon: <Shield size={28} /> }
] as const;
type CategoryType = typeof CATEGORY_LIST[number]['name'];

interface QuizFormProps {
    setShowQuizForm: () => void;
    yunitData: any;
    lesson: any;
    classGrade: string;
    callFetchLessons: any;
}

const defaultQuestion = (type: string) => ({
    type,
    question: "",
    options: type === "multiple" ? ["", "", "", ""] : [],
    answer: 0,
    answers: type === "enumeration" ? [""] : [""],
    image: null,
    imageFile: null,
});

const QuizForm = ({ setShowQuizForm, yunitData, lesson, classGrade, callFetchLessons }: QuizFormProps) => {
    
    const { currentUser } = useAuth();
    const [isRegister, setIsRegister] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryType>("Pagpabasa");
    const [selectedType, setSelectedType] = useState("multiple");
    const [categoryQuestions, setCategoryQuestions] = useState<Record<CategoryType, Question[]>>({
        Pagpabasa: [defaultQuestion("multiple")],
        Gramatika: [defaultQuestion("multiple")],
        Pagpapahalaga: [defaultQuestion("multiple")],
    });

    // Helper to update questions for the current category
    const setQuestions = (qs: any[]) => {
        setCategoryQuestions(prev => ({
            ...prev,
            [selectedCategory]: qs,
        }));
    };
    const questions = categoryQuestions[selectedCategory];

    // Handlers (modular, work per category)
    const handleQuestionChange = (idx: number, value: string) => {
        setQuestions(questions.map((q, i) => i === idx ? { ...q, question: value } : q));
    };
    const handleOptionChange = (qIdx: number, optIdx: number, value: string) => {
        setQuestions(questions.map((q, i) =>
            i === qIdx ? { ...q, options: q.options.map((opt: string, oi: number) => oi === optIdx ? value : opt) } : q
        ));
    };
    const handleImageChange = (qIdx: number, file: File | null) => {
        if (!file) {
            setQuestions(questions.map((q, i) =>
                i === qIdx ? { ...q, image: null, imageFile: null } : q
            ));
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setQuestions(questions.map((q, i) =>
                i === qIdx ? { ...q, image: reader.result, imageFile: file } : q
            ));
        };
        reader.readAsDataURL(file);
    };
    const handleAnswerChange = (qIdx: number, ansIdx: number) => {
        setQuestions(questions.map((q, i) => i === qIdx ? { ...q, answer: ansIdx } : q));
    };
    const addQuestion = () => {
        // Ensure we don't exceed 10 questions
        if (questions.length >= 10) return;
        setQuestions([
            ...questions,
            defaultQuestion(selectedType)
        ]);
    };
    const removeQuestion = (idx: number) => {
        setQuestions(questions.length > 1 ? questions.filter((_, i) => i !== idx) : questions);
    };
    const handleAnswerTextChange = (qIdx: number, ansIdx: number, value: string) => {
        setQuestions(questions.map((q, i) =>
            i === qIdx
                ? { ...q, answers: q.answers.map((a: string, ai: number) => ai === ansIdx ? value : a) }
                : q
        ));
    };
    const addEnumerationAnswer = (qIdx: number) => {
        setQuestions(questions.map((q, i) =>
            i === qIdx ? { ...q, answers: [...q.answers, ""] } : q
        ));
    };
    const removeEnumerationAnswer = (qIdx: number, ansIdx: number) => {
        setQuestions(questions.map((q, i) =>
            i === qIdx && q.answers.length > 1
                ? { ...q, answers: q.answers.filter((_: string, ai: number) => ai !== ansIdx) }
                : q
        ));
    };
    const handleSubmitQuiz = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        // validate each category has at least one question
        if (Object.values(categoryQuestions).some(qs => qs.some(q => !q.question.trim()))) {
            toast.error(<CustomToast title='Something went wrong!' subtitle="Please make sure every question in every category has text before submitting." />);
            return;
        }
        if (!isRegister) {
            setIsRegister(true);
            try {
                let allSuccess = true;
                for (const cat of CATEGORY_LIST) {
                    let qs = categoryQuestions[cat.name];
                    // Compress and upload images for each question
                    qs = await Promise.all(qs.map(async (q, idx) => {
                        if (q.imageFile) {
                            let fileToUpload = q.imageFile;
                            const IMAGE_MAX_MB = 2;
                            if (fileToUpload.size > IMAGE_MAX_MB * 1024 * 1024) { // 2MB
                                try {
                                    fileToUpload = await imageCompression(fileToUpload, {
                                        maxSizeMB: 2,
                                        maxWidthOrHeight: 1920,
                                        useWebWorker: true,
                                    });
                                } catch (err) {
                                    toast.error(<CustomToast title='Image Compression Failed' subtitle='Proceeding with original image.' />);
                                }
                            }
                            // Upload to Firebase
                            const storageRef = ref(storage, `quiz_images/${Date.now()}_${fileToUpload.name}`);
                            await uploadBytes(storageRef, fileToUpload);
                            const downloadURL = await getDownloadURL(storageRef);
                            return { ...q, image: downloadURL, imageFile: null }; // Store URL, remove File
                        }
                        return { ...q, imageFile: null }; // Remove File if no image
                    }));
                    if (qs.length === 0 || qs.every(q => !q.question.trim())) continue; // skip empty
                    const response = await doCreateQuiz(currentUser?.uid || "", yunitData.id, lesson.id, classGrade, qs, cat.name) as any;
                    if (!response?.success) allSuccess = false;
                }
                if (allSuccess) {
                    toast.success(<CustomToast title='Quiz Created!' subtitle="Your quiz has been successfully created." />);
                    setShowQuizForm();
                    callFetchLessons();
                    setIsRegister(false);
                } else {
                    toast.error(<CustomToast title='Error!' subtitle='Failed to create quiz. Please try again.' />);
                    setIsRegister(false);
                }
            } catch (error) {
                toast.error(<CustomToast title='Error!' subtitle='An unexpected error occurred while creating the quiz.' />);
                setIsRegister(false);
            } finally {
                setIsRegister(false);
            }
        }
    };

    const renderSummary = () => (
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-[#2C3E50] flex items-center gap-2">
                <span className="inline-block w-2 h-6 bg-gradient-to-b from-[#2C3E50] to-[#34495e] rounded-full mr-2" />
                Quiz Overview
            </h2>
            <div className="flex gap-6">
                {CATEGORY_LIST.map(cat => {
                    const hasQuestions = categoryQuestions[cat.name].length > 0;
                    const hasContent = categoryQuestions[cat.name].some(q => q.question.trim());
                    return (
                        <motion.div
                            key={cat.name}
                            className={`flex flex-col items-center px-6 py-4 rounded-2xl border-2 shadow-md w-full transition-all duration-200 cursor-pointer group
                                ${selectedCategory === cat.name
                                    ? "border-[#2C3E50] bg-gradient-to-br from-[#f4f7fa] to-[#e8ecf1] scale-105 shadow-lg"
                                    : "border-gray-200 bg-white hover:scale-105 hover:border-[#2C3E50]/40"}
                            `}
                            onClick={() => setSelectedCategory(cat.name)}
                            whileHover={{ scale: 1.07 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <div className={`mb-2 ${selectedCategory === cat.name ? "text-[#2C3E50]" : "text-gray-400 group-hover:text-[#2C3E50]"}`}>
                                {cat.icon}
                            </div>
                            <span className="font-semibold text-base mb-1">{cat.name}</span>
                            <span className="text-xs text-gray-500 mb-1">
                                {categoryQuestions[cat.name].length} question{categoryQuestions[cat.name].length !== 1 ? "s" : ""}
                            </span>
                            {hasContent && (
                                <CheckCircle2 className="text-green-500 mt-1" size={20} />
                            )}
                            {!hasQuestions && (
                                <span className="text-xs text-red-400 mt-1">No questions</span>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );

    // useAutoHideScrollbar('.hs');

    return (
        <div className="overflow-hidden">
            <motion.div
                className="flex flex-col"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <div className="flex items-center gap-4 border-b-2 border-[#BDC3C7] bg-[#2C3E50] text-white shadow-sm">
                    <motion.button
                        type="button"
                        className="flex items-center p-6 transition-colors duration-200 group"
                        onClick={() => {
                            setShowQuizForm();
                        }}
                        aria-label="Bumalik sa mga Yunit"
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.96 }}
                        disabled={isRegister}
                    >
                        <ChevronLeft className="mr-2" size={26} />
                        <span className="text-lg font-semibold">
                            Bumalik
                        </span>
                    </motion.button>
                    <div className="flex-1">
                        <h1 className="truncate text-xl font-bold tracking-tight ml-20">
                            Aralin {lesson?.aralinNumero}
                            <span className="mx-2 font-extrabold">•</span>
                            <span className="text-2xl">{lesson?.aralinPamagat}</span>
                        </h1>   
                    </div>
                    <motion.button
                        type="button"
                        className="bg-white text-[#2C3E50] font-extrabold text-lg px-8 py-6"
                        onClick={handleSubmitQuiz}
                        disabled={isRegister}
                        aria-label="Submit quiz"
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.96 }}
                    >   
                        {isRegister ? 
                            <div className="flex items-center justify-center gap-2">
                                <SpinLoadingColored />
                                Publishing...
                            </div>
                        :
                            'Publish Quiz'
                        }
                    </motion.button>
                </div>
                <div className='w-full flex items-center justify-center py-2 bg-gray-300'>
                    {/* Floating left nav for quiz categories */}
                    <div className="flex flex-col items-center justify-center h-full z-30">
                        <nav className="bg-gradient-to-b bg-[#2C3E50] w-20 rounded-l-3xl shadow-2xl p-12 flex flex-col items-center border border-[#2C3E50]/30">
                            <div className="flex flex-col gap-6 w-full items-center">
                                {CATEGORY_LIST.map((cat) => (
                                    <motion.button
                                        key={cat.name}
                                        type="button"
                                        className={`relative w-14 h-14 flex flex-col items-center justify-center rounded-full font-semibold text-base transition-all duration-200 group
                                            ${selectedCategory === cat.name
                                                ? "bg-white text-[#2C3E50] shadow-lg ring-2 ring-[#2C3E50]/30"
                                                : "bg-transparent text-white hover:bg-white/10"}`}
                                        onClick={() => setSelectedCategory(cat.name)}
                                        aria-label={`Set quiz category to ${cat.name}`}
                                        whileHover={{ scale: 1.06 }}
                                        whileTap={{ scale: 0.96 }}
                                    >
                                        {cat.icon}
                                        <span className={`absolute left-18 bg-[#2C3E50] text-white px-6 py-4 rounded-r-lg shadow-lg text-base font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10`}>
                                            {cat.name}
                                        </span>
                                    </motion.button>
                                ))}
                                {/* Insert image button */}
                                <label
                                    className="relative w-14 h-14 flex flex-col items-center justify-center rounded-full font-semibold text-base transition-all duration-200 bg-[#2C3E50] text-white hover:bg-[#34495e] hover:scale-105 shadow-lg group cursor-pointer"
                                    title="Attach image to question"
                                    aria-label="Attach image to question"
                                >
                                    <ImagePlus size={28} />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer width-full h-full"
                                        onChange={e => {
                                            const file = e.target.files?.[0] || null;
                                            if (file) {
                                                // Attach image to the last question
                                                handleImageChange(questions.length - 1, file);
                                            }
                                            // Reset input so same file can be selected again
                                            e.target.value = "";
                                        }}
                                        disabled={isRegister}
                                    />
                                    <span className={`absolute left-18 bg-[#2C3E50] text-white px-6 py-4 rounded-r-lg shadow-lg text-base font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10`}>
                                        Magdagdag ng Larawan
                                    </span>
                                </label>
                                <button
                                    type="button"
                                    className="relative w-14 h-14 flex flex-col items-center justify-center rounded-full font-semibold text-base transition-all duration-200 bg-[#2C3E50] text-white hover:bg-[#34495e] hover:scale-105 shadow-lg group"
                                    onClick={addQuestion}
                                    aria-label="Add question"
                                    title="Add question"
                                    disabled={questions.length >= 10 || isRegister}
                                >
                                    <PlusCircle size={28} />
                                    <span className={`absolute left-18 bg-[#2C3E50] text-white px-6 py-4 rounded-r-lg shadow-lg text-base font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10`}>
                                        Magdagdag ng Tanong
                                    </span>
                                </button>
                            </div>
                        </nav>
                    </div>
                    <div className="hs hide-scrollbar w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-100 p-10 space-y-10 max-h-[80vh] overflow-y-scroll transition-all duration-300">
                        {/* Quiz summary */}
                        {renderSummary()}
                        {/* Floating question type nav */}
                        <div className="sticky top-0 z-20 flex justify-center mb-8">
                            <nav className="inline-flex bg-gradient-to-r from-[#2C3E50]/90 to-[#34495e]/90 rounded-full shadow-lg px-2 py-2 gap-2">
                                {["multiple", "identification", "enumeration"].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        className={`px-6 py-2 rounded-full font-semibold text-base transition-all duration-200
                                            ${selectedType === type
                                                ? "bg-white text-[#2C3E50] shadow"
                                                : "bg-transparent text-white hover:bg-white/20"}`}
                                        onClick={() => setSelectedType(type)}
                                        aria-label={`Set new questions to ${type}`}
                                    >
                                        {type === "multiple" && "Multiple Choice"}
                                        {type === "identification" && "Identification"}
                                        {type === "enumeration" && "Enumeration"}
                                    </button>
                                ))}
                            </nav>
                        </div>
                        {questions.map((q, qIdx) => (
                            <motion.div
                                key={qIdx}
                                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 mb-8 shadow-md flex flex-col gap-5 border border-gray-100 relative group transition-all duration-200"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: qIdx * 0.1 }}
                            >
                                <button
                                    type="button"
                                    className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition text-2xl font-bold opacity-0 group-hover:opacity-100 focus:opacity-100"
                                    onClick={() => removeQuestion(qIdx)}
                                    disabled={questions.length === 1 || isRegister}
                                    title="Remove question"
                                    aria-label="Remove question"
                                >
                                    <span aria-hidden>×</span>
                                </button>
                                <label className="block">
                                    <span className="sr-only">Question {qIdx + 1}</span>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#2C3E50]/40 focus:outline-none text-lg bg-white shadow-sm"
                                        placeholder="Enter your question here"
                                        value={q.question}
                                        onChange={e => handleQuestionChange(qIdx, e.target.value)}
                                        aria-label={`Question ${qIdx + 1}`}
                                        autoFocus={qIdx === questions.length - 1}
                                        disabled={isRegister}
                                    />
                                </label>
                                {q.image && (
                                    <div className="flex flex-col items-center">
                                        <div className="relative group w-full flex justify-center">
                                            <img
                                                src={q.image}
                                                alt={`Preview for question ${qIdx + 1}`}
                                                className="max-h-56 max-w-full rounded-xl border-2 border-[#2C3E50]/10 shadow-lg object-contain transition-all duration-200"
                                            />
                                            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition">
                                                {/* Change Image Button */}
                                                <label className="bg-white/80 hover:bg-blue-500 hover:text-white text-blue-500 rounded-full p-2 shadow-lg cursor-pointer transition-all duration-150">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={e => {
                                                            const file = e.target.files?.[0] || null;
                                                            if (file) handleImageChange(qIdx, file);
                                                            e.target.value = "";
                                                        }}
                                                        aria-label="Change image"
                                                        disabled={isRegister}
                                                    />
                                                    <span className="text-xs font-bold">Change</span>
                                                </label>
                                                {/* Remove Image Button */}
                                                <button
                                                    type="button"
                                                    className="bg-white/80 hover:bg-red-500 hover:text-white text-red-500 rounded-full p-2 shadow-lg transition-all duration-150"
                                                    onClick={() => handleImageChange(qIdx, null)}
                                                    aria-label="Remove image"
                                                    title="Remove image"
                                                    disabled={isRegister}
                                                >
                                                    <span className="text-lg font-bold">×</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {q.type === "multiple" && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                        {q.options.map((opt: string, optIdx: number) => (
                                            <div key={optIdx} className="flex items-center gap-3 bg-white rounded-lg px-3 py-2 border border-gray-100 shadow-sm">
                                                <input
                                                    type="radio"
                                                    name={`answer-${qIdx}`}
                                                    checked={q.answer === optIdx}
                                                    onChange={() => handleAnswerChange(qIdx, optIdx)}
                                                    className="accent-[#2C3E50] scale-125"
                                                    aria-label={`Mark as correct answer for option ${optIdx + 1}`}
                                                    disabled={isRegister}
                                                />
                                                <input
                                                    type="text"
                                                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#2C3E50]/30 focus:outline-none bg-gray-50"
                                                    placeholder={`Option ${optIdx + 1}`}
                                                    value={opt}
                                                    onChange={e => handleOptionChange(qIdx, optIdx, e.target.value)}
                                                    aria-label={`Option ${optIdx + 1}`}
                                                    disabled={isRegister}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {q.type === "identification" && (
                                    <label className="block">
                                        <span className="sr-only">Correct answer</span>
                                        <input
                                            type="text"
                                            className="w-full px-5 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#2C3E50]/30 focus:outline-none mt-2 bg-white shadow-sm"
                                            placeholder="Correct answer"
                                            value={q.answers[0]}
                                            onChange={e => handleAnswerTextChange(qIdx, 0, e.target.value)}
                                            aria-label="Correct answer"
                                            disabled={isRegister}
                                        />
                                    </label>
                                )}
                                {q.type === "enumeration" && (
                                    <div className="flex flex-col gap-3 mt-2">
                                        {q.answers.map((ans: string, ansIdx: number) => (
                                            <div key={ansIdx} className="flex gap-2 items-center">
                                                <input
                                                    type="text"
                                                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#2C3E50]/30 focus:outline-none bg-gray-50"
                                                    placeholder={`Answer ${ansIdx + 1}`}
                                                    value={ans}
                                                    onChange={e => handleAnswerTextChange(qIdx, ansIdx, e.target.value)}
                                                    aria-label={`Enumeration answer ${ansIdx + 1}`}
                                                    disabled={isRegister}
                                                />
                                                <button
                                                    type="button"
                                                    className="text-red-500 px-3 py-1 rounded hover:bg-red-50 transition disabled:opacity-50"
                                                    onClick={() => removeEnumerationAnswer(qIdx, ansIdx)}
                                                    disabled={q.answers.length === 1 || isRegister}
                                                    title="Remove answer"
                                                    aria-label="Remove enumeration answer"
                                                >×</button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            className="text-[#2C3E50] px-4 py-2 border border-[#2C3E50] rounded-lg mt-2 hover:bg-[#2C3E50] hover:text-white transition font-medium"
                                            onClick={() => addEnumerationAnswer(qIdx)}
                                            aria-label="Add enumeration answer"
                                            disabled={isRegister}
                                        >+ Add Answer</button>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                        <div className="flex justify-between items-center mt-8">
                            <span className="text-gray-400 text-base">{questions.length} question{questions.length > 1 ? "s" : ""}</span>
                        </div>
                        {/* Modern Progress Bar with Label and Animation */}
                        <div className="w-full flex flex-col gap-2">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-semibold text-[#2C3E50]">
                                    Progress
                                </span>
                                <span className="text-xs font-semibold text-[#2C3E50]">
                                    {questions.length} / 10
                                </span>
                            </div>
                            <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner" aria-label="Quiz progress">
                                <div
                                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#2C3E50] via-[#34495e] to-[#6c7a89] rounded-full transition-all duration-500"
                                    style={{
                                        width: `${Math.min((questions.length / 10) * 100, 100)}%`,
                                    }}
                                />
                                <div
                                    className="absolute left-0 top-0 h-full flex items-center justify-end pr-2"
                                    style={{
                                        width: `${Math.min((questions.length / 10) * 100, 100)}%`,
                                    }}
                                >
                                    <span className="text-xs font-bold text-white drop-shadow-sm">
                                        {Math.min(questions.length * 10, 100)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default QuizForm;