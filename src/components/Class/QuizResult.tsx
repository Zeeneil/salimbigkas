import React from "react";
import { SquareX, Check, X } from "lucide-react";

interface QuizResultProps {
    result: { score: number; total: number };
    answers: { [key: string]: any };
    quizData: any;
    onClose: () => void;
}

const QuizResult = ({result, answers, quizData, onClose,}: QuizResultProps) => (
    <div className="flex items-center justify-center py-2 min-h-screen relative">
        <div className="flex items-center justify-center h-full z-30">
            <nav className="bg-[#2C3E50] w-20 rounded-l-3xl shadow-2xl p-12 flex items-center justify-center border border-[#2C3E50]/30">
                <div className="flex flex-col gap-6 items-center">
                    <button
                        type="button"
                        className="relative w-14 h-14 flex flex-col items-center justify-center rounded-full font-semibold text-base transition-all duration-200 bg-[#2C3E50] text-white hover:bg-[#34495e] hover:scale-105 shadow-lg group"
                        onClick={onClose}
                        aria-label="Close results"
                        title="Close results"
                    >
                        <SquareX size={28} />
                        <span className="absolute left-18 bg-[#2C3E50] text-white px-6 py-4 rounded-r-lg shadow-lg text-base font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                            Isara ang Resulta
                        </span>
                    </button>
                </div>
            </nav>
        </div>
        <div className="w-full min-w-3xl max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 p-10 space-y-10 max-h-[100vh] overflow-y-scroll transition-all duration-300">
            <h2 className="text-3xl font-extrabold mb-8 text-center text-[#2C3E50] drop-shadow-lg tracking-wide">
                Quiz Results
            </h2>
            <div className="flex flex-col items-center mb-8">
                <span className="text-5xl font-bold text-[#27ae60] mb-2">
                    {result.score} / {result.total}
                </span>
                <span className="text-lg text-gray-600">
                    {result.score === result.total
                        ? "Perfect!"
                        : result.score > result.total / 2
                        ? "Good job!"
                        : "Keep practicing!"}
                </span>
            </div>
            <div className="space-y-8">
                {quizData.questions.map((q: any, qIdx: number) => {
                    // User answer
                    let userAnswer;
                    if (q.type === "multiple") {
                        userAnswer = typeof answers[qIdx] !== "undefined" ? q.options[answers[qIdx]] : "";
                    } else if (q.type === "identification") {
                        userAnswer = answers[qIdx] || "";
                    } else if (q.type === "enumeration") {
                        userAnswer = (q.answers || []).map((_: any, ansIdx: number) => answers[`${qIdx}-${ansIdx}`] || "");
                    }
                    // Correct answer
                    let correctAnswer;
                    if (q.type === "multiple") {
                        correctAnswer = q.options[q.answer];
                    } else if (q.type === "identification") {
                        correctAnswer = Array.isArray(q.answers) ? q.answers[0] : q.answers;
                    } else if (q.type === "enumeration") {
                        correctAnswer = q.answers || [];
                    }
                    // Is correct
                    let isCorrect = false;
                    if (q.type === "multiple") {
                        isCorrect = answers[qIdx] === q.answer;
                    } else if (q.type === "identification") {
                        isCorrect =
                            (userAnswer || "").trim().toLowerCase() ===
                            (correctAnswer || "").trim().toLowerCase();
                    } else if (q.type === "enumeration") {
                        const userAnsArr: string[] = (userAnswer || []).map((a: string) => (a || "").trim().toLowerCase());
                        const correctAnsArr: string[] = (correctAnswer || []).map((a: string) => (a || "").trim().toLowerCase());
                        isCorrect =
                            correctAnsArr.every((ans: string) => userAnsArr.includes(ans)) &&
                            userAnsArr.length === correctAnsArr.length;
                    }
                    return (
                        <div
                            key={qIdx}
                            className={`p-6 rounded-xl shadow-lg border-l-8 ${
                                isCorrect
                                    ? "border-[#27ae60] bg-green-50"
                                    : "border-[#e74c3c] bg-red-50"
                            }`}
                        >
                            <div className="mb-3 font-bold text-lg text-[#2C3E50] flex items-center gap-2">
                                <span className={`rounded-full px-3 py-1 text-sm font-bold shadow ${
                                    isCorrect ? "bg-green-100 text-[#27ae60]" : "bg-red-100 text-[#e74c3c]"
                                }`}>
                                    Q{qIdx + 1}
                                </span>
                                <span>{q.question}</span>
                                {isCorrect ? (
                                    <Check color="#27ae60" size={24} strokeWidth={6} className="ml-2" />
                                ) : (
                                    <X color="#e74c3c" size={24} strokeWidth={6} className="ml-2" />
                                )}
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
                            <div className="flex flex-col sm:flex-row gap-4 mt-2">
                                <div className="flex-1">
                                    <div className="text-gray-700 font-semibold mb-1">Your Answer:</div>
                                    {q.type === "enumeration" ? (
                                        <ul className="list-decimal ml-6">
                                            {(userAnswer || []).map((ans: string, idx: number) => (
                                                <li key={idx} className="text-base">
                                                    {ans || <span className="italic text-gray-400">No answer</span>}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="text-base">
                                            {userAnswer || <span className="italic text-gray-400">No answer</span>}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="text-gray-700 font-semibold mb-1">Correct Answer:</div>
                                    {q.type === "enumeration" ? (
                                        <ul className="list-decimal ml-6">
                                            {(correctAnswer || []).map((ans: string, idx: number) => (
                                                <li key={idx} className="text-base font-bold text-[#27ae60]">
                                                    {ans}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="text-base font-bold text-[#27ae60]">
                                            {correctAnswer}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
);

export default QuizResult;