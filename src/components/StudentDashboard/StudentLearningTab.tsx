import { useState, useEffect } from 'react';
import { doGetAllClasses } from '../../api/functions';
import { useAuth } from "../../hooks/authContext";
import { motion } from 'framer-motion';
import Class from '../Class/Class';
import SkeletonClass from '../SkeletonLoaders/SkeletonClass';
import { Plus } from 'lucide-react';
import JoinClassByCodeModal from '../Modals/JoinClassByCodeModal';

const StudentLearningTab = ({ Tab }: { Tab: () => string }) => {

    const skeletonArray = Array.from({ length: 12 }, (_, index) => <SkeletonClass key={index} />);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();
    const [showClass, setShowClass] = useState(false);
    const [showJoinClass, setShowJoinClass] = useState(false);
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClassData, setSelectedClassData] = useState<any | null>(null);
    
    const fetchandSetClasses = async () => {
        try {
            const response = await doGetAllClasses(currentUser?.uid || "") as any;
            if (response?.classes?.length > 0) {
                setClasses(response?.classes);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching classes:", error);
        }
    }

    useEffect(() => {
        fetchandSetClasses();
    }, []);

    return (
        <>
            {showClass ? (
                <Class
                    setShowClass={() => setShowClass(!showClass)}
                    classData={selectedClassData}
                />
            ) : (
                <>
                    {Tab() === "my-learning" && (
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <h1 className="text-2xl font-bold tracking-normal">
                                    My Learning
                                </h1>
                                <div className="flex items-center">
                                    <motion.button 
                                        type="button"
                                        className="flex px-4 py-2 text-lg font-bold text-white items-center bg-[#2C3E50] rounded-lg shadow-sm hover:bg-[#34495E] transition duration-200 ease-in-out"
                                        onClick={() => setShowJoinClass(!showJoinClass)}
                                        aria-label="Add users"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Join class
                                    </motion.button>
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-4">
                                {loading ? (
                                    skeletonArray
                                ) : (
                                    classes?.map((classItem, index) => (
                                        <motion.div
                                            key={index}
                                            className="relative"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                <button
                                                    type='button'
                                                    className='rounded-lg bg-white shadow-sm border border-gray-200 p-4 w-full items-center justify-center'
                                                    title={classItem.className}
                                                    onClick={() => {
                                                        setSelectedClassData(classItem);
                                                        setShowClass(true);
                                                    }}
                                                >
                                                    <div className='w-full flex flex-col items-center justify-between bg-[#2C3E50] p-8 rounded-lg text-white tracking-wider line-clamp-2'>
                                                        <h2 className="text-4xl font-extrabold">{classItem.classGrade}</h2>
                                                        <h4 className='mt-2 font-semibold'>{classItem.className}</h4>
                                                    </div>
                                                    {/* Date and time */}
                                                    <div className='w-full flex items-center justify-between'>
                                                        <p className="mt-2 text-gray-600 text-sm">Days: {classItem.days.join("/ ")}</p>
                                                        <p className="mt-2 text-gray-600 text-sm">Time: {classItem.time}</p>
                                                    </div>
                                                </button>
                                            </motion.div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                    {showJoinClass && (
                        <div className={'fixed inset-0 bg-black/80 z-50 backdrop-blur-sm flex items-center justify-center'}>
                            <JoinClassByCodeModal
                                isOpen={showJoinClass}
                                onClose={() => setShowJoinClass(!showJoinClass)}
                                callFetchClasses={fetchandSetClasses}
                            />
                        </div>
                    )}
                </>
            )}
        </>
    );
}

export default StudentLearningTab;