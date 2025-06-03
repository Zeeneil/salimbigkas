import { useState, useEffect } from 'react';
import { Plus, Trash2, Ellipsis, SquarePen, Copy, CircleFadingPlus } from 'lucide-react';
import { doGetAllClasses, doDeleteClass } from '../../api/functions';
import { useAuth } from "../../hooks/authContext";
import { motion } from 'framer-motion';
import { toast } from "react-toastify";
import CustomToast from "../Toast/CustomToast";
import Popup from 'reactjs-popup';
import AddClass from './AddClass';
import UpdateClass from './UpdateClass';
import DeleteModal from "../Modals/DeleteModal";
import Class from './Class';
import SkeletonClass from '../SkeletonLoaders/SkeletonClass';
import JoinClassByCodeModal from '../Modals/JoinClassByCodeModal';

const ClassesTab = ({ Tab }: { Tab: () => string }) => {

    const skeletonArray = Array.from({ length: 12 }, (_, index) => <SkeletonClass key={index} />);
    const [loading, setLoading] = useState(true);
    const { currentUser, role } = useAuth();
    const [showJoinClass, setShowJoinClass] = useState(false);
    const [showUpdateClass, setShowUpdateClass] = useState(false);
    const [showaddClass, setShowAddClass] = useState(false);
    const [showClass, setShowClass] = useState(false);
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClassData, setSelectedClassData] = useState<any | null>(null);
    const [selectedClass, setSelectedClass] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
            {showaddClass ? (
                <AddClass
                    setShowAddClass={() => setShowAddClass(!showaddClass)}
                    callFetchClasses={fetchandSetClasses}
                />
            ) : showUpdateClass ? (
                <UpdateClass
                    setShowUpdateClass={() => setShowUpdateClass(!showUpdateClass)}
                    callFetchClasses={fetchandSetClasses}
                    classData={selectedClassData}
                />
            ) : showClass ? (
                <Class
                    setShowClass={() => setShowClass(!showClass)}
                    classData={selectedClassData}
                />
            ) : (
                <>
                    {Tab() === "classes" && (
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <h1 className="text-2xl font-bold tracking-normal">
                                    {role === "Teacher" ? "My Classes" : "Classes"}
                                </h1>
                                <div className="flex items-center">
                                    <Popup
                                        trigger={
                                            <button
                                                title='Options'
                                                aria-label="Options"
                                                type='button'
                                                className="flex px-8 py-4 gap-2 text-lg font-bold text-white items-center bg-[#2C3E50] rounded-lg shadow-sm hover:bg-[#34495E] transition duration-200 ease-in-out"
                                                tabIndex={0}
                                            >
                                                <CircleFadingPlus className="h-6 w-6" />
                                                Join or create a class
                                            </button>
                                        }
                                        position="bottom center"
                                        on="click"
                                        closeOnDocumentClick
                                        arrow={false}
                                        contentStyle={{ padding: 0, border: 'none', background: 'transparent', boxShadow: 'none' }}
                                        nested
                                        lockScroll
                                        children={((close: () => void) => (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="flex flex-col bg-white shadow-xl rounded-lg mt-2 border border-gray-200 min-w-[160px] focus:outline-none"
                                                tabIndex={-1}
                                                onKeyDown={e => {
                                                    if (e.key === 'Escape') close();
                                                }}
                                            >   
                                                <motion.button 
                                                    type="button"
                                                    className='flex items-center px-6 py-4 text-gray-700 hover:bg-gray-100 rounded transition text-base'
                                                    onClick={() => {
                                                        setShowAddClass(!showaddClass);
                                                        close();
                                                    }}
                                                    aria-label="Add users"
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Create new class
                                                </motion.button>
                                                <motion.button 
                                                    type="button"
                                                    className='flex items-center px-6 py-4 text-gray-700 hover:bg-gray-100 rounded transition text-base'
                                                    onClick={() => {
                                                        setShowJoinClass(!showJoinClass);
                                                        close();
                                                    }}
                                                    aria-label="Add users"
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Join class
                                                </motion.button>
                                            </motion.div>
                                        )) as any}
                                    />
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
                                                <Popup
                                                    trigger={
                                                        <button
                                                            title='Options'
                                                            aria-label="Options"
                                                            type='button'
                                                            className='absolute top-2 right-2 p-2 rounded-full bg-white shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2C3E50]'
                                                            tabIndex={0}
                                                        >
                                                            <Ellipsis className="h-6 w-6" />
                                                        </button>
                                                    }
                                                    position="bottom right"
                                                    on="click"
                                                    closeOnDocumentClick
                                                    arrow={false}
                                                    contentStyle={{ padding: 0, border: 'none', background: 'transparent', boxShadow: 'none' }}
                                                    overlayStyle={{ background: 'rgba(0,0,0,0.3)' }}
                                                    nested
                                                    lockScroll
                                                    children={((close: () => void) => (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.95 }}
                                                            className="flex flex-col bg-white shadow-xl rounded-lg mt-2 border border-gray-200 min-w-[160px] focus:outline-none"
                                                            tabIndex={-1}
                                                            onKeyDown={e => {
                                                                if (e.key === 'Escape') close();
                                                            }}
                                                        >   
                                                            <button
                                                                type='button'
                                                                className='flex items-center px-6 py-4 text-gray-700 hover:bg-gray-100 rounded transition text-base'
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedClassData(classItem);
                                                                    setShowUpdateClass(true);
                                                                    close();
                                                                }}
                                                            >
                                                                <SquarePen className="h-4 w-4 mr-2" />
                                                                Edit Class
                                                            </button>
                                                            <button
                                                                type='button'
                                                                className='flex items-center px-6 py-4 text-red-500 hover:bg-red-50 rounded transition text-base'
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedClass(classItem.id);
                                                                    setIsDeleteModalOpen(true);
                                                                    close();
                                                                }}
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Delete Class
                                                            </button>
                                                            <button
                                                                type='button'
                                                                className='flex items-center px-6 py-4 text-gray-700 hover:bg-gray-100 rounded transition text-base'
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    navigator.clipboard.writeText(classItem.code);
                                                                    toast.success(<CustomToast title="Class code copied!" subtitle="The class code has been copied to your clipboard." />);
                                                                    close();
                                                                }}
                                                            >
                                                                <Copy className="h-4 w-4 mr-2" />
                                                                Copy class code
                                                            </button>
                                                        </motion.div>
                                                    )) as any}
                                                />
                                            </motion.div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </>
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
            {isDeleteModalOpen && (
                <div className={'fixed inset-0 bg-black/80 z-50 backdrop-blur-sm flex items-center justify-center'}>
                    <DeleteModal
                        entityType="class"
                        isOpen={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
                        onDelete={async () => {
                            try {
                                const response = await doDeleteClass(currentUser?.uid || "", selectedClass) as any;
                                if (response?.success) {
                                    toast.success(<CustomToast title="Congratulation!" subtitle="Selected class deleted successfully." />);
                                    fetchandSetClasses(); // Refresh the class list
                                    setSelectedClass(''); // Clear selected users
                                    setIsDeleteModalOpen(false);
                                } else {
                                    toast.error(<CustomToast title="Something went wrong!" subtitle="Failed to delete this class. Please try again." />);
                                    setIsDeleteModalOpen(false);
                                }
                            } catch (error) {
                                toast.error(<CustomToast title="Something went wrong!" subtitle="Failed to delete this class. Please try again." />);
                                setIsDeleteModalOpen(false);
                            }
                        }}
                    />
                </div>
            )}
        </>
    );
}

export default ClassesTab;