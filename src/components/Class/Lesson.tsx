
import { useEffect, useState, useRef, MouseEvent, JSX } from "react";
import { useAuth } from "../../hooks/authContext";
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import CustomToast from "../Toast/CustomToast";
import { ChevronLeft, CircleAlert, BookOpenText, FilePen, FileQuestion, Sparkles } from 'lucide-react';
import { SpinLoadingWhite } from "../Icons/icons";
import { dogetAllQuizzes } from "../../api/functions";
import QuizTake from "./QuizTake";
import QuizResult from "./QuizResult";
import useLessonTimeTracker from "./useLessonTimeTracker";

interface LessonProps {
    setShowLesson: () => void;
    yunitId: string;
    classId: string;
    classGrade: string;
    LessonData: any;
}

const Lesson = ({ setShowLesson, yunitId, classId, classGrade, LessonData }: LessonProps) => {
    
    const { currentUser } = useAuth();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
    const [showQuizTake, setShowQuizTake] = useState<boolean>(false);
    const [showQuizResult, setShowQuizResult] = useState<boolean>(false);
    
    type Tab = "about" | "pagbasa" | "gramatika" | "pagpapahalaga" | "pagsusulit";
  
    const [activeTab, setActiveTab] = useState<Tab>("about");

    const NavItems: { tab: Tab; label: string;}[] = [
        { tab: "about", label: "Tungkol sa aralin" },
        { tab: "pagbasa", label: "Pagbasa" },
        { tab: "gramatika", label: "Gramatika" },
        { tab: "pagpapahalaga", label: "Pagpapahalaga" },
        { tab: "pagsusulit", label: "Pagsusulit" }
    ];

    const NavButton = ({ tab, label }: { tab: Tab; label: string; }) => {
        return (
            <button
                type="button"
                className={`relative flex items-center gap-2 px-4 py-5 rounded-t-lg transition-colors duration-200 outline-none
                    ${activeTab === tab
                        ? 'bg-white text-[#2C3E50] font-semibold border-b-4 border-b-[#2C3E50] shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100 border-b-4 border-b-transparent'
                    }`}
                onClick={() => handleTabChange(tab)}
                aria-label={`Go to ${label}`}
            >
                <span className="text-sm font-medium">{label}</span>
            </button>
        );
    };

    const handleTabChange = (tab: Tab) => {
        if (tab === activeTab) return; // Prevent reloading the same tab
            setLoading(true);
            setTimeout(() => {
                setActiveTab(tab);
                setLoading(false);
        }, 100);
    };

    const fetchandSetQuizzes = async () => {
        try {
            setLoading(true);
            const response = await dogetAllQuizzes(currentUser?.uid || "", yunitId, LessonData.id, classGrade) as any;
            if (response?.quizzes) {
                setQuizzes(response.quizzes);
                setLoading(false);
            }
        } catch (error) {
            toast.error(<CustomToast title='Error!' subtitle='Failed to fetch quizzes.' />)
            setLoading(false);
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchandSetQuizzes();
    }, [yunitId, LessonData.id, classGrade]);

    // Track time spent on lesson
    useLessonTimeTracker({
        userId: currentUser?.uid,
        yunitId,
        lessonId: LessonData.id,
    });
    return (
        <div className="overflow-hidden">
            <motion.div
                className="fixed top-0 left-0 w-full h-full z-30 bg-white shadow-md flex flex-col"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >   
                {/* Header with Back Button */}
                <motion.nav
                    className="bg-white shadow-md mb-4"
                    initial={{ y: -80 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >   
                    <div className="flex items-center justify-between">
                        <motion.button
                            type="button"
                            className="flex items-center text-gray-700 hover:text-gray-900 font-bold bg-none transition duration-200 px-8 py-4"
                            onClick={setShowLesson}
                            aria-label="back to classes"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ChevronLeft className="mr-2" size={24} />
                            <span className="tracking-wider text-lg">Aralin {LessonData.aralinNumero}</span>
                        </motion.button>
                        {/* nav menu like course info, others */}
                        <div className="flex items-center gap-4 ">
                            {NavItems.map((item) => (
                                <NavButton key={item.tab} tab={item.tab} label={item.label} />
                            ))}
                        </div>
                        <motion.button
                            type="button"
                            className='bg-[#2C3E50] text-white px-15 py-5 shadow-md drop-shadow-lg text-base hover:font-medium hover:border-[#386BF6] hover:bg-[#34495e]'
                            onClick={() => {
                                const currentIdx = NavItems.findIndex(item => item.tab === activeTab);
                                if (currentIdx < NavItems.length - 1) {
                                    handleTabChange(NavItems[currentIdx + 1].tab);
                                }else {
                                    handleTabChange(NavItems[0].tab);
                                }
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Next
                        </motion.button>
                    </div>
                </motion.nav>
                <div className="border-1 border-gray-200 shadow-sm h-full">
                    <div className="flex flex-col items-center space-y-8">
                        {activeTab === "about" && (
                            <div className="w-full flex flex-col items-center mt-10 mb-8 px-4">
                                <motion.h1
                                    className="text-center w-full max-w-2xl px-8 py-4 rounded-2xl shadow-lg bg-gradient-to-r from-[#6DD5FA] to-[#2980B9] text-white text-4xl font-extrabold tracking-wide mb-6"
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                >
                                    {LessonData.aralinPamagat}
                                </motion.h1>
                                <motion.div
                                    className="mb-4"
                                    initial={{ y: -10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.4 }}
                                >
                                    <span className="inline-block bg-yellow-200 rounded-full p-3 shadow-md">
                                        <CircleAlert className="text-yellow-600" size={36} />
                                    </span>
                                </motion.div>
                                <motion.div
                                    className="w-full max-w-6xl bg-white rounded-xl shadow-xl p-6 flex flex-col items-center border-2 border-[#6DD5FA]/30"
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                >
                                    <label
                                        htmlFor="aralinPaglalarawan"
                                        className="block text-lg font-semibold text-[#2980B9] mb-3"
                                    >
                                        Tungkol sa Aralin
                                    </label>
                                    <div
                                        className="w-full px-2 py-3 rounded-lg bg-[#f0f7fa] text-lg text-gray-800 text-justify min-h-[100px] max-h-100 overflow-y-auto transition-all duration-200"
                                    >
                                        {LessonData.aralinPaglalarawan}
                                    </div>
                                </motion.div>
                            </div>
                        )}
                        {/* {activeTab === "Videos" && 
                            <div className="w-full max-w-6xl flex flex-col items-center">
                                {LessonData.fileUrls?.filter((url: string) => url.match(/\.(mp4|webm|ogg)(\?|$)/i)).length === 0 ? (
                                    <p className="text-gray-600">No videos uploaded.</p>
                                ) : (
                                    <div className="flex flex-col gap-4 w-full items-center mt-5">
                                        {LessonData.fileUrls
                                            .filter((url: string) => url.match(/\.(mp4|webm|ogg)(\?|$)/i))
                                            .map((url: string, idx: number) => (
                                                <video key={idx} controls className="w-full max-w-2xl rounded shadow">
                                                    <source src={url} />
                                                    {url}
                                                    Your browser does not support the video tag.
                                                </video>
                                            ))}
                                    </div>
                                )}
                            </div>
                        } */}
                        {activeTab === "pagbasa" && 
                            <div className="w-full flex flex-col items-center">
                                {LessonData.fileUrls[0].pagbasaUrls?.filter((url: string) =>
                                    url.match(/\.(pdf|doc|docx|ppt|pptx)(\?|$)/i)
                                ).length === 0 ? (
                                    <p className="text-gray-600">No PDF, Word, or PowerPoint files uploaded.</p>
                                ) : (
                                    <div className="w-full flex flex-col gap-2">
                                        {LessonData.fileUrls[0].pagbasaUrls
                                            .filter((url: string) => url.match(/\.(pdf|doc|docx|ppt|pptx)(\?|$)/i))
                                            .map((url: string, idx: number) => (
                                                <iframe
                                                    key={idx}
                                                    src={`https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`}
                                                    title={`File preview ${idx + 1}`}
                                                    className="rounded shadow-inner bg-white w-full h-[720px] overflow-hidden"
                                                    allowFullScreen
                                                />
                                            ))}
                                    </div>
                                )}
                            </div>
                        }
                        {activeTab === "gramatika" && 
                            <div className="w-full flex flex-col items-center">
                                {LessonData.fileUrls[0].gramatikaUrls?.filter((url: string) =>
                                    url.match(/\.(pdf|doc|docx|ppt|pptx)(\?|$)/i)
                                ).length === 0 ? (
                                    <p className="text-gray-600">No PDF, Word, or PowerPoint files uploaded.</p>
                                ) : (
                                    <div className="w-full flex flex-col gap-2">
                                        {LessonData.fileUrls[0].gramatikaUrls
                                            .filter((url: string) => url.match(/\.(pdf|doc|docx|ppt|pptx)(\?|$)/i))
                                            .map((url: string, idx: number) => (
                                                <iframe
                                                    key={idx}
                                                    src={`https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`}
                                                    title={`File preview ${idx + 1}`}
                                                    className="rounded shadow-inner bg-white w-full h-[720px] overflow-hidden"
                                                    allowFullScreen
                                                />
                                            ))}
                                    </div>
                                )}
                            </div>
                        }
                        {activeTab === "pagpapahalaga" && 
                            <div className="w-full flex flex-col items-center">
                                {LessonData.fileUrls[0].pagpapahalagaUrls?.filter((url: string) =>
                                    url.match(/\.(pdf|doc|docx|ppt|pptx)(\?|$)/i)
                                ).length === 0 ? (
                                    <p className="text-gray-600">No PDF, Word, or PowerPoint files uploaded.</p>
                                ) : (
                                    <div className="w-full flex flex-col gap-2">
                                        {LessonData.fileUrls[0].pagpapahalagaUrls
                                            .filter((url: string) => url.match(/\.(pdf|doc|docx|ppt|pptx)(\?|$)/i))
                                            .map((url: string, idx: number) => (
                                                <iframe
                                                    key={idx}
                                                    src={`https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`}
                                                    title={`File preview ${idx + 1}`}
                                                    className="rounded shadow-inner bg-white w-full h-[720px] overflow-hidden"
                                                    allowFullScreen
                                                />
                                            ))}
                                    </div>
                                )}
                            </div>
                        }
                        {activeTab === "pagsusulit" && (
                            <>
                                {showQuizTake ? 
                                    <QuizTake
                                        setShowQuizTake={() => setShowQuizTake(false)}
                                        callFetchQuizzes={fetchandSetQuizzes}
                                        classId={classId}
                                        quizData={selectedQuiz}
                                    />
                                :   showQuizResult ? 
                                        <QuizResult
                                            result={{
                                                score: selectedQuiz?.response?.score,
                                                total: selectedQuiz?.response?.total
                                            }}
                                            answers={selectedQuiz?.response?.answers}
                                            quizData={selectedQuiz}
                                            onClose={() => {
                                                setShowQuizResult(false);
                                            }}
                                        />
                                :
                                    <div className="w-full flex flex-col items-center mt-30 p-6">
                                        <motion.div
                                            className="w-full max-w-4xl bg-[#2C3E50] rounded-2xl shadow-2xl border border-[#6DD5FA]/30"
                                            initial={{ scale: 0.97, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ duration: 0.4, ease: "easeOut" }}
                                        >
                                            <div className="flex items-center justify-between px-8 py-6 border-b border-[#6DD5FA]/20">
                                                <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
                                                    <FilePen className="text-[#6DD5FA]" size={28} />
                                                    Mga Pagsusulit
                                                </h2>
                                                {loading && (
                                                    <span className="ml-2">
                                                        <SpinLoadingWhite />
                                                    </span>
                                                )}
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-[#6DD5FA]/30">
                                                    <thead className="bg-[#f0f7fa]">
                                                        <tr>
                                                            <th className="px-6 py-3 text-left text-xs font-bold text-[#2980B9] uppercase tracking-wider">#</th>
                                                            <th className="px-6 py-3 text-left text-xs font-bold text-[#2980B9] uppercase tracking-wider">Kategorya</th>
                                                            <th className="px-6 py-3 text-left text-xs font-bold text-[#2980B9] uppercase tracking-wider">Bilang ng Tanong</th>
                                                            <th className="px-6 py-3 text-left text-xs font-bold text-[#2980B9] uppercase tracking-wider">Progress</th>
                                                            <th className="px-6 py-3"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-[#6DD5FA]/10">
                                                        {quizzes.length === 0 && !loading ? (
                                                            <tr>
                                                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-lg">
                                                                    <span role="img" aria-label="No Quiz" className="text-3xl">😔</span>
                                                                    <div className="mt-2 font-semibold">Walang pagsusulit na natagpuan.</div>
                                                                </td>
                                                            </tr>
                                                        ) : (
                                                            quizzes.map((quiz, idx) => (
                                                                <motion.tr
                                                                    key={quiz.id || idx}
                                                                    className="hover:bg-[#eaf6fb] transition text-left"
                                                                    initial={{ opacity: 0, y: 10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    transition={{ delay: 0.05 * idx }}
                                                                >
                                                                    <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-[#2980B9]">{idx + 1}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-[#2C3E50]">
                                                                        <span className="inline-flex items-center gap-1">
                                                                            <BookOpenText className="text-[#6DD5FA]" size={20} />
                                                                            {quiz.category || 'Walang Pamagat'}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-[#2980B9] font-medium">
                                                                        <span className="inline-flex items-center gap-1">
                                                                            <FileQuestion className="text-[#6DD5FA]" size={20} />
                                                                            {quiz.questions?.length ?? 0}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="w-32 bg-gray-200 rounded-full h-4 overflow-hidden">
                                                                                <div
                                                                                    className="bg-[#F4D03F] h-4 rounded-full transition-all duration-300"
                                                                                    style={{
                                                                                        width: `${quiz.response?.progress ? Math.round(quiz.response?.progress * 100) : 0}%`
                                                                                    }}
                                                                                ></div>
                                                                            </div>
                                                                            <span className="text-sm font-semibold text-[#2980B9]">
                                                                                {quiz.response?.progress ? `${Math.round(quiz.response?.progress * 100)}%` : '0%'}
                                                                            </span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                                        {quiz.response ?
                                                                            <button
                                                                                type="button"
                                                                                className='transition-all duration-200 px-6 py-2 rounded-xl text-base font-bold shadow-md bg-[#2C3E50] text-white hover:scale-105 hover:shadow-lg'
                                                                                onClick={() => {
                                                                                    setSelectedQuiz(quiz);
                                                                                    setShowQuizResult(true);
                                                                                }}
                                                                                title="I-review ang pagsusulit"
                                                                            >
                                                                                <span className="flex items-center gap-1">
                                                                                    I-review
                                                                                </span>
                                                                            </button>
                                                                        :
                                                                            <button
                                                                                type="button"
                                                                                className='transition-all duration-200 px-6 py-2 rounded-xl text-base font-bold shadow-md bg-[#F39C12] text-white hover:scale-105 hover:shadow-lg'
                                                                                onClick={() => {
                                                                                    setSelectedQuiz(quiz);
                                                                                    setShowQuizTake(true);
                                                                                }}
                                                                                title="Simulan"
                                                                            >
                                                                                <span className="flex items-center gap-1">
                                                                                    Simulan
                                                                                </span>
                                                                            </button>
                                                                        }
                                                                    </td>
                                                                </motion.tr>
                                                            ))
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                            {quizzes.length > 0 && (
                                                <div className="flex justify-center py-6">
                                                    <span className="text-white text-lg font-semibold">
                                                        Good luck, mag-aaral!
                                                        <Sparkles color="yellow" className="inline-block ml-2" size={24} strokeWidth={3} />
                                                    </span>
                                                </div>
                                            )}
                                        </motion.div>
                                    </div>
                                }
                            </>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default Lesson;