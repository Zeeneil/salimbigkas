import { useState, JSX } from "react";
import { motion } from 'framer-motion';
import { ChevronLeft, Home, UserRoundCog, BookUser, Presentation, GraduationCap } from 'lucide-react';
import ClassHome from "./ClassHome";
import MyCourses from "./MyCourses";
import ClassGrade from "./ClassGrade";
import ManageMembers from "./ManageMembers";
import { useAuth } from "../../hooks/authContext";

interface ClassProps {
    setShowClass: () => void;
    classData: any;
}

const Class = ({ setShowClass, classData }: ClassProps) => {
    const { role } = useAuth();

    type Tab = "home" | "my-courses" | "grades" | "manage-students";
  
    const [activeTab, setActiveTab] = useState<Tab>("home");

    let label;
    {role !== "Student" ?
        label = "Manage members" :
        label = "Classmates"
    }
    const NavItems: { tab: Tab; label: string; icon: JSX.Element }[] = [
        { tab: "home", label: "Home", icon: <Home size={22} /> },
        { tab: "my-courses", label: "My courses", icon: <Presentation size={22} /> },
        { tab: "grades", label: "Grades", icon: <BookUser size={22} /> },
        { tab: "manage-students", label: label, icon: <UserRoundCog size={22} /> },
    ];

    // Handle tab change with loading animation
    const handleTabChange = (tab: Tab) => {
        if (tab === activeTab) return; // Prevent reloading the same tab
        setTimeout(() => {
            setActiveTab(tab);
        }, 100);
    };

    const NavButton = ({
        label,
        icon,
        onClick,
        isActive = false,
    }: {
        label: string;
        icon: JSX.Element;
        onClick: () => void;
        isActive?: boolean;
    }) => (
        <motion.button
            type="button"
            className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors duration-150 ${
                isActive ? "bg-[#2C3E50] text-white shadow" : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={onClick}
            aria-label={label}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
        >
            <div className="flex items-center gap-3">
                {icon}
                <span className="font-semibold whitespace-nowrap">{label}</span>
            </div>
        </motion.button>
    );

    const formattedClassName = () => {
        const names = (classData.className || "").split(" ").filter(Boolean);
        if (names.length === 0) return "?";
        if (names.length === 1) return names[0][0].toUpperCase();
        return (names[0][0] + " " + names[1][0]).toUpperCase();
    }

    return (
        <div className="bg-white flex flex-1 h-[92vh] max-h-[92vh]">
            <motion.aside
                className="p-6 space-y-6 border-r-2 border-[#BDC3C7] shadow-sm bg-white min-w-[260px] flex flex-col justify-between"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <div className="flex flex-col gap-4 h-full">
                    <div className="flex flex-col items-start">
                        <motion.button
                            type="button"
                            className="flex items-center gap-2 text-2xl font-bold truncate transition duration-200 ease-in-out hover:text-[#2C3E50]"
                            onClick={setShowClass}
                            aria-label="Back"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ChevronLeft size={22} strokeWidth={4} />
                            <span className="text-2xl font-bold tracking-tight truncate">{classData.className}</span>
                        </motion.button>
                        <div
                            className="w-full h-[200px] mt-6 mx-auto flex items-center justify-center bg-[#2C3E50] rounded-2xl text-white text-6xl font-bold select-none"
                        >
                            {formattedClassName()}
                        </div>
                    </div>
                    <nav className="flex flex-col gap-2">
                        {NavItems.map((item) => (
                            <NavButton
                            key={item.tab}
                            label={item.label}
                            icon={item.icon}
                            isActive={activeTab === item.tab}
                            onClick={() => handleTabChange(item.tab)}
                            />
                        ))}
                    </nav>
                </div>
                <div className="text-gray-500">
                    <h2 className="text-2xl font-bold text-[#2C3E50]">{classData.classGrade}</h2>
                </div>
            </motion.aside>
            <main className="flex-1 overflow-y-auto bg-white">
                <motion.div 
                    className="max-w-8xl mx-auto space-y-6 overflow-visible"
                    key={activeTab}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >   
                    <ClassHome Tab={() => (activeTab === "home" ? "home" : "")} classId={classData.id} />
                    <MyCourses Tab={() => (activeTab === "my-courses" ? "my-courses" : "")} classId={classData.id} classGrade={classData.classGrade} />
                    <ClassGrade Tab={() => (activeTab === "grades" ? "grades" : "")} classId={classData.id} classGrade={classData.classGrade} />
                    <ManageMembers Tab={() => (activeTab === "manage-students" ? "manage-students" : "")} classId={classData.id} classGrade={classData.classGrade}/>

                </motion.div>
            </main>
        </div>
    );
}

export default Class;