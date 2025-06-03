import React, { useState } from "react";
import { Send, SquareX } from "lucide-react";
import { useAuth } from "../../hooks/authContext";
import { doSubmitQuizAnswers } from "../../api/functions";
import { toast } from "react-toastify";
import CustomToast from "../../components/Toast/CustomToast";
import { SpinLoadingWhite } from "../Icons/icons";
import QuizResult from "./QuizResult";

interface QuizProps {
    setShowQuizTake: () => void;
    callFetchQuizzes: any;
    classId: string;
    quizData: any;
}

const QuizTake = ({ setShowQuizTake, callFetchQuizzes, classId, quizData }: QuizProps) => {
    
    const { currentUser } = useAuth();
    const [answers, setAnswers] = useState<{ [key: string]: any }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<{ score: number; total: number }>({ score: 0, total: 0 });
    const [showResults, setShowResults] = useState(false);

    if (!quizData || !quizData.questions) {
        return <div>No quiz data available.</div>;
    }

    const handleChange = (qIdx: number, value: any) => {
        setAnswers(prev => ({ ...prev, [qIdx]: value }));
    };

    let score = 0;
    let total = quizData.questions.length;
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Validation: Check if all questions are answered
        const unanswered = quizData.questions.some((q: any, qIdx: number) => {
            if (q.type === "multiple" || q.type === "identification") {
                return !answers[qIdx] && answers[qIdx] !== 0; // 0 is a valid answer for multiple choice
            }
            if (q.type === "enumeration") {
                return (q.answers || []).some((_: any, ansIdx: number) => !answers[`${qIdx}-${ansIdx}`]);
            }
            return false;
        });
        if (unanswered) {
            toast.error(<CustomToast title="Incomplete!"subtitle="Please answer all questions before submitting."/>);
            return;
        }

        quizData.questions.forEach((q: any, qIdx: number) => {
            if (q.type === "multiple") {
                // For multiple choice, compare selected index to correct answer index
                if (answers[qIdx] === q.answer) {
                    score++;
                }
            } else if (q.type === "identification") {
                // For identification, compare trimmed/lowercased answer to correct answer(s)
                const userAns = (answers[qIdx] || "").trim().toLowerCase();
                const correctAns = Array.isArray(q.answers) ? q.answers[0] : q.answers;
                if (userAns && correctAns && userAns === correctAns.trim().toLowerCase()) {
                    score++;
                }
            } else if (q.type === "enumeration") {
                // For enumeration, compare each answer (order-insensitive)
                const userAnsArr: string[] = [];
                for (let i = 0; i < (q.answers?.length || 0); i++) {
                    userAnsArr.push((answers[`${qIdx}-${i}`] || "").trim().toLowerCase());
                }
                const correctAnsArr: string[] = (q.answers || []).map((a: string) => a.trim().toLowerCase());
                // Count as correct if all provided answers match (order-insensitive)
                const allCorrect = correctAnsArr.every((ans: string) => userAnsArr.includes(ans));
                if (allCorrect && userAnsArr.length === correctAnsArr.length) {
                    score++;
                }
            }
        });
        if (!isSubmitting) {
            setIsSubmitting(true);
            try {
                const response = await doSubmitQuizAnswers(currentUser?.uid || "", quizData.yunitId, classId, quizData.lessonId, quizData.id, answers, score, total) as any;
                if (response?.success) {
                    setIsSubmitting(false);
                    callFetchQuizzes();
                    setResult({ score, total });
                    setShowResults(true);
                }
            } catch (error) {
                toast.error(<CustomToast title='Something went wrong!' subtitle='Sorry, we encountered an error while submitting your quiz.' />)
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="w-full flex items-center justify-center py-2 bg-gray-100 min-h-screen relative">
            {showResults ?
                <QuizResult
                    result={result}
                    answers={answers}
                    quizData={quizData}
                    onClose={() => {
                        setShowResults(false);
                        setShowQuizTake();
                    }}
                />
            :
                <>
                    <div className="flex flex-col items-center justify-center h-full z-30">
                        <nav className="bg-[#2C3E50] w-20 rounded-l-3xl shadow-2xl p-12 flex flex-col items-center justify-center border border-[#2C3E50]/30">
                            <div className="flex flex-col gap-6 w-full items-center">
                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    className="relative w-14 h-14 flex flex-col items-center justify-center rounded-full font-semibold text-base transition-all duration-200 bg-[#2C3E50] text-white hover:bg-[#34495e] hover:scale-105 shadow-lg group"
                                    onClick={setShowQuizTake}
                                    aria-label="Close quiz"
                                    title="Close quiz"
                                >
                                    <SquareX size={28} />
                                    <span className={`absolute left-18 bg-[#2C3E50] text-white px-6 py-4 rounded-r-lg shadow-lg text-base font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10`}>
                                        Isara ang Pagsusulit
                                    </span>
                                </button>
                                <button
                                    type="submit"
                                    form="form"
                                    disabled={isSubmitting}
                                    className="relative w-14 h-14 flex flex-col items-center justify-center rounded-full font-semibold text-base transition-all duration-200 bg-[#2C3E50] text-white hover:bg-[#34495e] hover:scale-105 shadow-lg group"
                                    aria-label="Submit answers"
                                    title="Submit answers"
                                >
                                    {isSubmitting ? 
                                        <span className="absolute inset-0 flex items-center justify-center bg-white/1 backdrop-blur-xs rounded-full z-10">
                                            <SpinLoadingWhite />
                                        </span>
                                    :
                                        <>
                                            <Send size={28} />
                                            <span className={`absolute left-18 bg-[#2C3E50] text-white px-6 py-4 rounded-r-lg shadow-lg text-base font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10`}>
                                                Isumite ang mga Sagot
                                            </span>
                                        </>
                                    }
                                </button>
                            </div>
                        </nav>
                    </div>
                    <form id="form" onSubmit={handleSubmit} className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-100 p-10 space-y-10 max-h-[100vh] overflow-y-scroll transition-all duration-300">
                        <h2 className="text-3xl font-extrabold mb-8 text-center text-[#2C3E50] drop-shadow-lg tracking-wide">
                            {quizData.category || "Quiz"}
                        </h2>
                        {quizData.questions.map((q: any, qIdx: number) => (
                            <div
                                key={qIdx}
                                className="mb-8 p-6 bg-white rounded-xl shadow-lg border-l-8 border-[#2C3E50] hover:scale-[1.02] transition-transform"
                            >
                                <div className="mb-3 font-bold text-lg text-[#2C3E50] flex items-center gap-2">
                                    <span className="bg-yellow-50 text-[#F4D03F] rounded-full px-3 py-1 text-sm font-bold shadow">
                                        Q{qIdx + 1}
                                    </span>
                                    <span>{q.question}</span>
                                </div>
                                {q.image && (
                                    <div className="flex justify-center mb-3">
                                        <img
                                            src={q.image}
                                            alt={`Q${qIdx + 1} image`}
                                            className="rounded-lg shadow-md max-h-48 border-2 border-[#F39C12]"
                                        />
                                    </div>
                                )}
                                {q.type === "multiple" && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                    {q.options.map((opt: string, optIdx: number) => (
                                    <label
                                        key={optIdx}
                                        className={`flex items-center gap-3 bg-orange-50 rounded-lg px-4 py-3 cursor-pointer border-2 transition-all ${
                                            answers[qIdx] === optIdx
                                                ? "border-[#F39C12] ring-2 ring-[#F39C12] shadow-lg"
                                                : "border-transparent hover:border-[#F39C12]"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name={`q${qIdx}`}
                                            value={optIdx}
                                            checked={answers[qIdx] === optIdx}
                                            onChange={() => handleChange(qIdx, optIdx)}
                                            className="accent-[#F39C12] w-5 h-5"
                                            disabled={isSubmitting}
                                        />
                                        <span className="font-medium text-gray-800">{opt}</span>
                                    </label>
                                    ))}
                                </div>
                                )}
                                {q.type === "identification" && (
                                    <input
                                        type="text"
                                        className="border-2 border-orange-200 focus:border-[#F39C12] focus:outline-none rounded-lg px-4 py-2 mt-3 w-full text-lg transition-all shadow-sm"
                                        placeholder="Type your answer here..."
                                        value={answers[qIdx] || ""}
                                        onChange={e => handleChange(qIdx, e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                )}
                                {q.type === "enumeration" && (
                                <div className="space-y-3 mt-3">
                                    {(q.answers || [1]).map((_: any, ansIdx: number) => (
                                        <input
                                            key={ansIdx}
                                            type="text"
                                            disabled={isSubmitting}
                                            className="border-2 border-orange-200 focus:border-[#F39C12] focus:outline-none rounded-lg px-4 py-2 w-full text-lg transition-all shadow-sm"
                                            placeholder={`Answer`}
                                            value={answers[`${qIdx}-${ansIdx}`] || ""}
                                            onChange={e =>
                                                setAnswers(prev => ({
                                                    ...prev,
                                                    [`${qIdx}-${ansIdx}`]: e.target.value
                                                }))
                                            }
                                        />
                                    ))}
                                </div>
                                )}
                            </div>
                        ))}
                    </form>
                </>
            }
        </div>
    );
};

export default QuizTake;