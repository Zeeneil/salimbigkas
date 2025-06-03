import { useEffect, useState, useRef, MouseEvent, JSX } from "react";
import { storage, ref, uploadBytes, getDownloadURL, deleteObject } from "../../firebase/firebase";
import { useAuth } from "../../hooks/authContext";
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import CustomToast from "../Toast/CustomToast";
import { NotebookPen, ChevronLeft, CircleAlert } from 'lucide-react';
import { SpinLoadingWhite } from "../Icons/icons";
import { doCreateLessonDraft } from "../../api/functions";
import QuizForm from "./QuizForm";
import FileInput from "../InputField/FileInput";

interface YunitLessonProps {
    setShowLessonForm: () => void;
    yunitData: any;
    callFetchLessons: any;
    classGrade: string;
}

const LessonForm = ({ setShowLessonForm, yunitData, callFetchLessons, classGrade }: YunitLessonProps) => {
    
    const { currentUser } = useAuth();
    const [aralinNumero, setAralinNumero] = useState<string>("");
    const [aralinPamagat, setAralinPamagat] = useState<string>("");
    const [aralinPaglalarawan, setAralinPaglalarawan] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isDraft, setIsDraft] = useState<boolean>(false);
    const [isContinue, setIsContinue] = useState<boolean>(false);
    const [showQuizForm, setShowQuizForm] = useState<boolean>(false);

    const [pagbasaFiles, setPagbasaFiles] = useState<File[]>([]);
    const [pagbasaUrls, setPagbasaUrls] = useState<string[]>([]);

    const [gramatikaFiles, setGramatikaFiles] = useState<File[]>([]);
    const [gramatikaUrls, setGramatikaUrls] = useState<string[]>([]);

    const [pagpapahalagaFiles, setPagpapahalagaFiles] = useState<File[]>([]);
    const [pagpapahalagaUrls, setPagpapahalagaUrls] = useState<string[]>([]);

    const [lesson, setLesson] = useState<any[]>([]);

    const handleContinue = async (e: MouseEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isContinue) {
            setIsContinue(true);
            try {
                const allFileUrls = [{
                    pagbasaUrls: pagbasaUrls,
                    gramatikaUrls: gramatikaUrls,
                    pagpapahalagaUrls: pagpapahalagaUrls,
                }];
                const response = await doCreateLessonDraft(currentUser?.uid || "", yunitData?.id, classGrade, isDraft, aralinNumero, aralinPamagat, aralinPaglalarawan, allFileUrls) as any;
                if (response?.success && response?.lesson) {
                    setLesson(response.lesson);
                    toast.success(<CustomToast title='Congratulation!' subtitle='Matagumpay kang lumikha ng isang bagong draft ng aralin.' />);
                    callFetchLessons();
                    setIsContinue(false);
                    setShowQuizForm(true);
                } else {
                    toast.error(<CustomToast title='Something went wrong!' subtitle='May nangyaring mali sa pagproseso ng iyong aralin. Pakisubukan muli.' />);
                    setIsContinue(false);
                }
            } catch (error) {
                setErrorMessage('May nangyaring mali sa pagproseso ng iyong aralin. Pakisubukan muli.');
                setIsContinue(false);
            } finally {
                setIsContinue(false);
            }
        }
    }

    const LessonDraftData = {
        yunitData,
        callFetchLessons,
        classGrade,
        setIsDraft,
        aralinNumero,
        aralinPamagat,
        aralinPaglalarawan,
        pagbasaUrls,
        gramatikaUrls,
        pagpapahalagaUrls
    }

    return (
        <>
            {showQuizForm ? 
                <QuizForm
                    setShowQuizForm={() => {
                        setShowQuizForm(!showQuizForm);
                        setShowLessonForm();
                    }}
                    yunitData={yunitData}
                    lesson={lesson}
                    classGrade={classGrade}
                    callFetchLessons={callFetchLessons} 
                />
            :
                <div className="overflow-hidden">
                    <motion.div
                        className="flex flex-col"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        <div className="flex items-center gap-4 p-4 border-b-2 border-[#BDC3C7] bg-[#2C3E50] text-white shadow-sm">
                            <motion.button
                                type="button"
                                className="flex items-center py-2 transition-colors duration-200 group"
                                onClick={() => {
                                    setShowLessonForm();
                                    
                                }}
                                aria-label="Bumalik sa mga Yunit"
                                whileHover={{ scale: 1.06 }}
                                whileTap={{ scale: 0.96 }}
                            >
                                <ChevronLeft className="mr-2" size={26} />
                                <span className="text-lg font-semibold">
                                    Bumalik
                                </span>
                            </motion.button>
                            <div className="flex-1 min-w-0">
                                <h1 className="truncate text-xl font-bold tracking-tight">
                                    Yunit {yunitData?.yunitnumber}
                                    <span className="mx-2 font-extrabold">•</span>
                                    <span className="text-2xl">{yunitData?.yunitname}</span>
                                </h1>   
                            </div>
                        </div>
                        <div className="flex flex-col p-6 max-h-[80vh] overflow-y-auto">
                            <div className="rounded-xl border-1 border-gray-200 shadow-sm p-8">
                                {/* Error message display */}
                                {errorMessage &&
                                    <motion.div
                                        className="relative flex mb-6 py-5 px-15 bg-[#FBE6E6] text-sm justify-center items-center rounded-sm shadow-sm drop-shadow-sm"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <CircleAlert className="absolute left-4 text-red-600" size={24} />
                                        <p>{errorMessage}</p>
                                    </motion.div>
                                }
                                {/* Registration form */}
                                <form onSubmit={handleContinue}>
                                    <div className="flex text-left mb-5 justify-between items-center">
                                        <div className="flex items-center justify-between gap-2">
                                            <NotebookPen size={34} />
                                            <div>
                                                <h1 className="text-2xl font-medium"> Bagong aralin</h1>
                                            <h3 className="text-sm text-gray-600">Mangyaring punan ang mga detalye sa ibaba upang magrehistro ng isang bagong aralin.</h3>
                                            </div>
                                        </div>
                                        <div className="flex gap-5 items-center">
                                            {/* Register button */}
                                            <button
                                                type="submit"
                                                className={`bg-[#2C3E50] text-lg text-white px-20 py-3 rounded-lg shadow-md drop-shadow-lg ${isContinue ? 'opacity-50 cursor-not-allowed' : 'hover:font-medium hover:border-[#386BF6] hover:bg-[#34495e]'}`}
                                                disabled={isContinue}
                                                onClick={() => {
                                                    setIsDraft(true);
                                                }}
                                            >
                                                {isContinue ? 
                                                    <div className="flex items-center justify-center gap-2">
                                                        <SpinLoadingWhite />
                                                        Drafting...
                                                    </div>
                                                :
                                                    'Ipagpatuloy'
                                                }
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-1 gap-4">
                                        {/* Lesson Number input */}
                                        <div className="text-left mt-4 mb-2">
                                            <div className="relative">
                                                <input
                                                    disabled={isContinue}
                                                    name='aralinNumero'
                                                    type="text"
                                                    id="aralinNumero"
                                                    autoComplete="aralinNumero"
                                                    required
                                                    autoFocus
                                                    minLength={1}
                                                    maxLength={30}
                                                    className={`w-full p-4 border rounded-sm transition-all duration-300 focus:ring-2 focus:ring-[#2C3E50] focus:outline-none ${aralinNumero ? 'border-[#2C3E50]' : 'border-gray-300'}`}
                                                    placeholder=" "
                                                    value={aralinNumero}
                                                    onChange={(e) => setAralinNumero(e.target.value)}
                                                    // Restrict input to letters and spaces only
                                                    onKeyDown={(e) => {
                                                        setErrorMessage('');
                                                        if (!/^\d*$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                                                            e.preventDefault();
                                                            setErrorMessage('Please enter a valid number.');
                                                            return;
                                                        }
                                                    }}
                                                />
                                                <label
                                                    className={`absolute text-lg font-medium left-4 top-4 text-[#2C3E50] px-1 transition-all duration-300 transform ${aralinNumero ? 'bg-white top-[-10px] text-[#2C3E50] text-sm' : 'top-4 text-gray-500 text-base'}`}
                                                    htmlFor="aralinNumero">
                                                    Numero
                                                </label>
                                            </div>
                                            <h4 className="mt-2 text-xs text-gray-500 font-semibold">(eg. Aralin 1, Aralin 2, ...)</h4>
                                        </div>
                                        {/* Class Name input */}
                                        <div className="text-left relative">
                                            <input
                                                disabled={isContinue}
                                                name='pamagat'
                                                type="text"
                                                id="pamagat"
                                                autoComplete="pamagat"
                                                required
                                                minLength={1}
                                                maxLength={30}
                                                className={`w-full p-4 border rounded-sm transition-all duration-300 focus:ring-2 focus:ring-[#2C3E50] focus:outline-none ${aralinPamagat ? 'border-[#2C3E50]' : 'border-gray-300'}`}
                                                placeholder=" "
                                                value={aralinPamagat}
                                                onChange={(e) => setAralinPamagat(e.target.value)}
                                                // Restrict input to letters and spaces only
                                                onKeyDown={() => {
                                                    setErrorMessage('');
                                                }}
                                            />
                                            <label
                                                className={`absolute text-lg font-medium left-4 top-4 text-[#2C3E50] px-1 transition-all duration-300 transform ${aralinPamagat ? 'bg-white top-[-10px] text-[#2C3E50] text-sm' : 'top-4 text-gray-500 text-base'}`}
                                                htmlFor="pamagat">
                                                Pamagat
                                            </label>
                                        </div>
                                        <div className="text-left relative">
                                            <textarea
                                                disabled={isContinue}
                                                name='description'
                                                id="description"
                                                autoComplete="description"
                                                required
                                                minLength={1}
                                                rows={3}
                                                className={`w-full p-4 border rounded-sm transition-all duration-300 focus:ring-2 focus:ring-[#2C3E50] focus:outline-none ${aralinPaglalarawan ? 'border-[#2C3E50]' : 'border-gray-300'}`}
                                                placeholder=" "
                                                value={aralinPaglalarawan}
                                                onChange={(e) => setAralinPaglalarawan(e.target.value)}
                                                onKeyDown={() => {
                                                    setErrorMessage('');
                                                }}
                                            />
                                            <label
                                                className={`absolute text-lg font-medium left-4 top-4 text-[#2C3E50] px-1 transition-all duration-300 transform ${aralinPaglalarawan ? 'bg-white top-[-10px] text-[#2C3E50] text-sm' : 'top-4 text-gray-500 text-base'}`}
                                                htmlFor="description"
                                            >
                                                Paglalarawan
                                            </label>
                                        </div>
                                        <div className="text-left relative">
                                            <h4 className="text-gray-500 font-semibold mb-2">Mga Nilalaman ng Aralin</h4>
                                            <FileInput
                                                label="I-upload ang Nilalaman ng Pagbasa"
                                                files={pagbasaFiles}
                                                setFiles={setPagbasaFiles}
                                                setFileUrls={setPagbasaUrls}
                                                disabled={isContinue}
                                                inputId="pagbasaContent"
                                                classGrade={classGrade}
                                            />
                                            <FileInput
                                                label="I-upload ang Nilalaman ng Gramatika"
                                                files={gramatikaFiles}
                                                setFiles={setGramatikaFiles}
                                                setFileUrls={setGramatikaUrls}
                                                disabled={isContinue}
                                                inputId="gramatikaContent"
                                                classGrade={classGrade}
                                            />
                                            <FileInput
                                                label="I-upload ang Nilalaman ng Pagpapahalaga"
                                                files={pagpapahalagaFiles}
                                                setFiles={setPagpapahalagaFiles}
                                                setFileUrls={setPagpapahalagaUrls}
                                                disabled={isContinue}
                                                inputId="pagpapahalagaContent"
                                                classGrade={classGrade}
                                            />
                                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 border border-gray-200 font-medium">
                                                    <span className="mr-1">Accepted:</span>
                                                    <span className="font-semibold text-[#2C3E50]">PDF</span>
                                                    <span className="mx-1">•</span>
                                                    <span className="font-semibold text-[#2C3E50]">DOC</span>
                                                    <span className="mx-1">•</span>
                                                    <span className="font-semibold text-[#2C3E50]">PPTX</span>
                                                    <span className="mx-1">•</span>
                                                    <span className="font-semibold text-[#2C3E50]">MP4</span>
                                                    <span className="mx-1">•</span>
                                                    <span className="font-semibold text-[#2C3E50]">MOV</span>
                                                    <span className="mx-1">•</span>
                                                    <span className="font-semibold text-[#2C3E50]">WEBM</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </div>
            }
        </>
    );
}

export default LessonForm;