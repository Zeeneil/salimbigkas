import { useEffect, useState } from "react";
import { doGetAllClassMembersGrade } from '../../api/functions';
import { useAuth } from "../../hooks/authContext";
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import CustomToast from "../Toast/CustomToast";
import * as XLSX from "xlsx";

interface ClassHomeProps {
    Tab: () => string;
    classId: string;
    classGrade: string;
}

const ClassGrade = ({ Tab, classId, classGrade }: ClassHomeProps) => {

    const { currentUser, role } = useAuth();
    const [grades, setGrades] = useState<any[]>([]);

    const fetchandSetGrades = async () => {
        try {
            const response = await doGetAllClassMembersGrade(classId, classGrade) as any;
            if (response?.members) {
                if (role === "Student" && currentUser?.uid) {
                    setGrades(response.members.filter((m: any) => m.uid === currentUser.uid));
                } else {
                    setGrades(response.members);
                }
            }
        } catch (error) {
            console.error("Error fetching class grades:", error);
        }
    };

    useEffect(() => {
        if (Tab() === "grades") {
            fetchandSetGrades();
        }
    }, [Tab, classId]);
    console.log("Class Grades:", grades);

    const exportToExcel = () => {
        // Prepare data for export
        const data = grades.map(member => ({
            Student: member.displayName,
            Quizzes: member.quizzesTaken,
            "Total Items": member.totalPossible,
            Score: member.totalScore,
            Grade: member.totalPossible > 0
                ? ((member.totalScore / member.totalPossible) * 100).toFixed(1) + "%"
                : "0.0%"
        }));

        // Create worksheet and workbook
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Grades");

        // Export to file
        XLSX.writeFile(workbook, "class_grades.xlsx");
    };

    return (
        <>
            {Tab() === "grades" && (
                <>
                    <motion.div
                        className="p-8 space-y-6 bg-white rounded-2xl shadow-xl border border-gray-100 min-h-screen"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                    >
                        <div className="flex items-center justify-between text-left">
                            <div>
                                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Grades</h2>
                                {role !== "Student" && <p className="text-gray-500 mt-1">View and manage your students' performance at a glance.</p>}
                            </div>
                            {role !== "Student" && 
                                <button
                                    type="button"
                                    onClick={exportToExcel}
                                    className="bg-[#2C3E50] text-white px-6 py-4 rounded-lg shadow hover:bg-indigo-700 transition"
                                >
                                    Export to Excel
                                </button>
                            }
                        </div>
                        <div className="overflow-x-auto mt-4">
                            <table className="min-w-full divide-y divide-gray-200 rounded-xl bg-white">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Student</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Quizzes</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Total Items</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Score</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Grade</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 max-h-[100vh] overflow-y-auto">
                                    {grades.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-gray-400 text-lg">
                                                No grades available.
                                            </td>
                                        </tr>
                                    ) : (
                                        grades.map((member, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 transition text-left">
                                                <td className="px-6 py-4 flex items-center gap-4">
                                                    {member.photoURL ? (
                                                        <img
                                                            src={member.photoURL}
                                                            alt={member.displayName}
                                                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-200 to-indigo-400 flex items-center justify-center text-indigo-700 font-bold text-lg">
                                                            {member.displayName?.[0] || "?"}
                                                        </div>
                                                    )}
                                                    <span className="font-semibold text-gray-800">{member.displayName}</span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-700">{member.quizzesTaken}</td>
                                                <td className="px-6 py-4 text-gray-700">{member.totalPossible}</td>
                                                <td className="px-6 py-4 text-gray-700">{member.totalScore}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold
                                                        ${member.totalPossible > 0
                                                            ? ((member.totalScore / member.totalPossible) * 100) >= 75
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-yellow-100 text-yellow-700"
                                                            : "bg-gray-100 text-gray-400"
                                                        }`
                                                    }>
                                                        {member.totalPossible > 0
                                                            ? ((member.totalScore / member.totalPossible) * 100).toFixed(1) + "%"
                                                            : "0.0%"
                                                        }
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </>
            )}
        </>
    );
}

export default ClassGrade;