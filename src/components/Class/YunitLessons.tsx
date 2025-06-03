
import { useEffect, useState, useRef, MouseEvent, JSX } from "react";
import { useAuth } from "../../hooks/authContext";
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { ChevronLeft, BookPlus, Book, BookDashed } from 'lucide-react';
import { SpinLoadingColored } from "../Icons/icons";
import DashboardCard from "../Card/DashboardCard";
import AccordionButton from "../Buttons/AccordionButton";
import LessonForm from "./LessonForm";
import Lesson from "./Lesson";
import { doGetAllLessons } from "../../api/functions";
import { formatUserDate } from "../../utils/helpers";
import QuizForm from "./QuizForm";

interface YunitLessonProps {
    setShowYunitLesson: () => void;
    yunitData?: any;
    classId: string;
    classGrade: string;
}

const YunitLessons = ({ setShowYunitLesson, yunitData, classId, classGrade }: YunitLessonProps) => {

    const { currentUser, role } = useAuth();
    const [showMgaAralin, setShowMgaAralin] = useState<boolean>(true);
    const [mgaAralin, setMgaAralin] = useState<any[]>([]);
    const [showIsDraft, setShowIsDraft] = useState<boolean>(false);
    const [isDraft, setIsDraft] = useState<any[]>([]);
    const [isLessonForm, setIsLessonForm] = useState(false);
    const [showQuizForm, setShowQuizForm] = useState(false);
    const [showLesson, setShowLesson] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState<any>(null);

    const fetchandSetLessons = async () => {
        try {
            const response = await doGetAllLessons(currentUser?.uid || "", yunitData?.id, classGrade) as any;
            if (response?.lessons) {
                const draftLessons = response.lessons.filter((lesson: any) => lesson.isDraft === true);
                const notDraftLessons = response.lessons.filter((lesson: any) => lesson.isDraft === false);
                setMgaAralin(notDraftLessons);
                setIsDraft(draftLessons);
            }
        } catch (error) {
            console.error("Error fetching lessons:", error);
        }
    };
    useEffect(() => {
        fetchandSetLessons();
    }, [yunitData, classGrade]);

    return (
        <>
            {isLessonForm ? 
                <LessonForm 
                    setShowLessonForm={() => setIsLessonForm(!isLessonForm)}
                    yunitData={yunitData}
                    callFetchLessons={fetchandSetLessons} 
                    classGrade={classGrade} 
                />
            : showLesson ?
                <Lesson
                    setShowLesson={() => setShowLesson(!showLesson)}
                    yunitId={yunitData.id}
                    classId={classId}
                    classGrade={classGrade}
                    LessonData={selectedLesson} 
                />
            : showQuizForm ?
                <QuizForm 
                    setShowQuizForm={() => setShowQuizForm(!showQuizForm)}
                    yunitData={yunitData}
                    lesson={selectedLesson}
                    classGrade={classGrade}
                    callFetchLessons={fetchandSetLessons}
                />
            :
                <div className="flex flex-1 w-full h-full overflow-hidden relative">
                    {role !== "Student" && 
                        <motion.button
                            type="button"
                            title="Gumawa ng bagong aralin"
                            aria-label="Gumawa ng bagong aralin"
                            id="bagong-aralin"
                            className="fixed bottom-4 right-4 size-16 z-50 bg-gradient-to-br from-[#2C3E50] via-[#34495E] to-[#2980B9] shadow-2xl rounded-full flex items-center justify-center border-4 border-white hover:scale-105 active:scale-95 transition-all duration-200 group"
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => {
                                setIsLessonForm(true);
                            }}
                        >
                            <motion.span
                                className="relative flex items-center justify-center w-full h-full"
                                initial={{ scaleX: 1 }}
                                animate={{ scaleX: [1, -1, 1] }}
                                transition={{ duration: 1, ease: "easeInOut" }}
                            >
                                <BookPlus
                                    color="#fff"
                                    size={34}
                                    strokeWidth={2.2}
                                    className="drop-shadow-lg group-hover:rotate-10 transition-transform duration-200"
                                />
                                {isLessonForm && (
                                    <span className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-full z-10">
                                        <SpinLoadingColored />
                                    </span>
                                )}
                            </motion.span>
                        </motion.button>
                    }
                    <motion.div
                        className="flex flex-col w-full h-full bg-white relative"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        <div className="flex items-center gap-4 p-4 border-b-2 border-[#BDC3C7] bg-[#2C3E50] text-white shadow-sm">
                            <motion.button
                                type="button"
                                className="flex items-center py-2 transition-colors duration-200 group"
                                onClick={setShowYunitLesson}
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
                        <div className="px-6 py-6 pb-2">
                            <h2 className="text-left text-2xl font-bold text-[#2C3E50]">Mga Aralin</h2>
                        </div>
                        <main className="flex-1 overflow-y-auto grid grid-cols-1 gap-8 px-6 mt-5">
                            {/* Dashboard Cards */}
                            {/* <div className="grid gap-6 md:grid-cols-2">
                                <DashboardCard
                                    title="Mga Aralin"
                                    value={mgaAralin.length}
                                    subtitle="Lessons created this month"
                                />
                                <DashboardCard
                                    title="Mga Draft na Aralin"
                                    value={isDraft.length}
                                    subtitle="Lessons created this month"
                                />
                            </div> */}

                            {/* Lessons Accordion */}
                            <section className="w-full mb-5">
                                <div className="rounded-xl bg-white shadow-md divide-y divide-gray-200 overflow-hidden">
                                    <AccordionButton
                                        icon={<Book size={22} />}
                                        label="Mga Aralin"
                                        color="blue"
                                        bgColor="white"
                                        isOpen={showMgaAralin}
                                        onClick={() => setShowMgaAralin(!showMgaAralin)}
                                    >
                                        {mgaAralin.length > 0 ? 
                                            <div className="grid gap-4">
                                                {mgaAralin.map((lesson, idx) => (
                                                    <motion.button
                                                        key={lesson.id || idx}
                                                        className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors shadow group
                                                            ${lesson.isDraft ? "bg-yellow-50 hover:bg-yellow-100 border-l-4 border-yellow-400" : "bg-blue-50 hover:bg-blue-100"}
                                                        `}
                                                        initial={{ opacity: 0, y: 30 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: idx * 0.1 }}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        type="button"
                                                        title={`Buksan ang aralin: ${lesson.aralinPamagat}`}
                                                        aria-label={`Buksan ang aralin: ${lesson.aralinPamagat}`}
                                                        onClick={() => {
                                                            if (!lesson.isDraft) {
                                                                setSelectedLesson(lesson);
                                                                setShowLesson(true);
                                                            }
                                                        }}
                                                    >
                                                        <Book className={`${lesson.isDraft ? "text-yellow-500" : "text-blue-500"} mr-4`} size={28} />
                                                        <div className="flex-1 text-left">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`font-semibold text-lg ${lesson.isDraft ? "text-yellow-900" : "text-blue-900"} group-hover:underline`}>
                                                                    Aralin {lesson.aralinNumero} - {lesson.aralinPamagat}
                                                                </span>
                                                                {!lesson.isDraft && (
                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-200 text-blue-800 border border-blue-300 animate-pulse">
                                                                        Published
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className={`text-sm ${lesson.isDraft ? "text-yellow-700" : "text-blue-700"}`}>
                                                                {(lesson.aralinPaglalarawan && lesson.aralinPaglalarawan.length > 80)
                                                                    ? lesson.aralinPaglalarawan.slice(0, 80) + "..."
                                                                    : (lesson.aralinPaglalarawan || "Walang deskripsyon")}
                                                            </div>
                                                        </div>
                                                        {/* <span className={`ml-4 text-xs ${lesson.isDraft ? "text-yellow-400" : "text-blue-400"}`}>
                                                            {formatUserDate(lesson.createdAt)}
                                                        </span> */}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        :
                                            <p className="text-gray-700">Published lessons and content go here.</p>
                                        }
                                    </AccordionButton>
                                    {role !== "Student" &&
                                        <AccordionButton
                                            icon={<BookDashed size={22} />}
                                            label="Mga Draft na Aralin"
                                            color="yellow"
                                            bgColor="white"
                                            isOpen={showIsDraft}
                                            onClick={() => setShowIsDraft(!showIsDraft)}
                                        >   
                                            {isDraft.length > 0 ? 
                                                <div className="grid gap-4">
                                                    {isDraft.map((lesson, idx) => (
                                                        <motion.button
                                                            key={lesson.id || idx}
                                                            className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors shadow group
                                                                ${lesson.isDraft ? "bg-yellow-50 hover:bg-yellow-100 border-l-4 border-yellow-400" : "bg-blue-50 hover:bg-blue-100"}
                                                            `}
                                                            initial={{ opacity: 0, y: 30 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: idx * 0.1 }}
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            type="button"
                                                            aria-label={`Buksan ang aralin: ${lesson.aralinPamagat}`}
                                                            onClick={() => {
                                                                if (lesson.isDraft) {
                                                                    setSelectedLesson(lesson);
                                                                    setShowQuizForm(true);
                                                                }
                                                            }}
                                                        >
                                                            <BookDashed className={`${lesson.isDraft ? "text-yellow-500" : "text-blue-500"} mr-4`} size={28} />
                                                            <div className="flex-1 text-left">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`font-semibold text-lg ${lesson.isDraft ? "text-yellow-900" : "text-blue-900"} group-hover:underline`}>
                                                                        Aralin {lesson.aralinNumero} - {lesson.aralinPamagat}
                                                                    </span>
                                                                    {lesson.isDraft && (
                                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-200 text-yellow-800 border border-yellow-300 animate-pulse">
                                                                            Draft
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className={`text-sm ${lesson.isDraft ? "text-yellow-700" : "text-blue-700"}`}>
                                                                    {(lesson.aralinPaglalarawan && lesson.aralinPaglalarawan.length > 80)
                                                                        ? lesson.aralinPaglalarawan.slice(0, 80) + "..."
                                                                        : (lesson.aralinPaglalarawan || "Walang deskripsyon")}
                                                                </div>
                                                            </div>
                                                            <span className={`ml-4 text-xs ${lesson.isDraft ? "text-yellow-400" : "text-blue-400"}`}>
                                                                {formatUserDate(lesson.createdAt)}
                                                            </span>
                                                        </motion.button>
                                                    ))}
                                                </div>
                                            :
                                                <p className="text-gray-700">Draft lessons and content go here.</p>
                                            }
                                        </AccordionButton>
                                    }
                                </div>
                            </section>
                        </main>
                    </motion.div>
                </div>
            }
        </>
    );
}

export default YunitLessons;