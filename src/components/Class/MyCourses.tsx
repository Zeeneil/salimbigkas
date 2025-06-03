import { useEffect, useState } from "react";
import { ChevronRight, SquarePen, Trash2, EllipsisVertical, LockKeyhole, LockKeyholeOpen } from 'lucide-react';
import { doGetAllYunits, doUpdateYunit, doDeleteYunit, doDeletePersonalYunit, doUpdatePersonalYunit } from '../../api/functions';
import { useAuth } from "../../hooks/authContext";
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { SpinLoadingColored } from "../Icons/icons";
import Popup from 'reactjs-popup';
import CustomToast from "../Toast/CustomToast";
import SkeletonYunit from '../SkeletonLoaders/SkeletonYunit';
import YunitModal from "../Modals/YunitModal";
import DeleteModal from "../Modals/DeleteModal";
import YunitLessons from "./YunitLessons";
import { SpinLoadingWhite } from '../Icons/icons';

interface CoursesProps {
    Tab: () => string;
    classId: string;
    classGrade: string;
}

const MyCourses = ({ Tab, classId, classGrade }: CoursesProps) => {
    
    const skeletonArray = Array.from({ length: 4 }, (_, index) => <SkeletonYunit key={index} />);
    const { currentUser, role } = useAuth();
    const [action, setAction] = useState<'add' | 'edit'>('add');
    const [isYunitModal, setIsYunitModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [yunits, setYunits] = useState<any[]>([]);
    const [selectedYunitData, setSelectedYunitData] = useState<any>(null);
    const [selectedYunit, setSelectedYunit] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [showYunitLesson, setShowYunitLesson] = useState(false);
    const [isUnlock, setIsUnlock] = useState(false);
    
    let response;
    const userId = currentUser?.uid || "";
    const fetchandSetYunits = async () => {
        try {
            const response = await doGetAllYunits(userId, classId) as any;
            // filter if global or personal yunits by isPersonal
            if (response?.yunits?.length > 0) {
                const filteredGlobalYunits = response.yunits.filter((yunit: any) => yunit.isPersonal === false);
                const filteredPersonalYunits = response.yunits.filter((yunit: any) => yunit.isPersonal === true);
                setYunits([...filteredGlobalYunits, ...filteredPersonalYunits]);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching yunits:", error);
        }
    }
    useEffect(() => {
        fetchandSetYunits();
    }, [userId, classId]);

    const handleUnlockYunit = async (yunitId: string, yunitnumber: number, yunitname: string, imagepath: string, imageurl: string) => {
        try {
            {role === 'Admin' ?
                response = await doUpdateYunit(userId, yunitId, false, yunitnumber, yunitname, imagepath, imageurl) as any
            :
                response = await doUpdatePersonalYunit(userId, yunitId, classId, false, yunitnumber, yunitname, imagepath, imageurl) as any
            }
            if (response?.success) {
                toast.success(<CustomToast title="Yunit updated!" subtitle="The yunit has been successfully unlocked." />);
                fetchandSetYunits();
                setIsUnlock(false);
            } else {
                toast.error(<CustomToast title="Something went wrong!" subtitle="Failed to unlock this yunit. Please try again." />);
            }
        } catch (error) {
            console.error("Error unlocking yunit:", error);
            toast.error(<CustomToast title="Something went wrong!" subtitle="Failed to unlock this yunit. Please try again." />);
        }
    }
    
    return (
        <>
            {showYunitLesson ? 
                <YunitLessons
                    setShowYunitLesson={() => setShowYunitLesson(false)}
                    yunitData={selectedYunitData}
                    classId={classId}
                    classGrade={classGrade}
                />
            :
                Tab() === "my-courses" && (
                    <div>
                        {role !== 'Student' && 
                            <motion.button
                                type="button"
                                title="Gumawa ng bagong yugto"
                                aria-label="Gumawa ng bagong yugto"
                                id="bagong-yugto"
                                className="fixed bottom-4 right-4 size-16 z-50 bg-gradient-to-br from-[#2C3E50] via-[#34495E] to-[#2980B9] shadow-2xl rounded-full flex items-center justify-center border-4 border-white hover:scale-105 active:scale-95 transition-all duration-200 group"
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => {
                                    setAction('add');
                                    setSelectedYunitData(null);
                                    setIsYunitModal(true);
                                }}
                            >
                                <motion.span 
                                    className="relative flex items-center justify-center w-full h-full"
                                    initial={{ scaleX: 1 }}
                                    animate={{ scaleX: [1, -1, 1] }}
                                    transition={{ duration: 1, ease: "easeInOut" }}
                                >
                                    <SquarePen
                                        color="#fff"
                                        size={34}
                                        strokeWidth={2.2}
                                        className="drop-shadow-lg group-hover:rotate-10 transition-transform duration-200"
                                    />
                                    {isYunitModal && (
                                        <span className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-full z-10">
                                            <SpinLoadingColored />
                                        </span>
                                    )}
                                </motion.span>
                                {/* <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1 rounded-lg shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200">
                                    Gumawa ng bagong yugto
                                </span> */}
                            </motion.button>
                        }
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white h-[90vh] max-h-[90vh]">
                            {loading ? (
                                skeletonArray
                            ) : (
                                yunits.map((unit, idx) => (
                                    <motion.div
                                        key={unit.id || idx}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <motion.div
                                            className={`h-full rounded-2xl shadow-lg bg-gradient-to-br from-[#2C3E50] via-[#34495E] to-[#2980B9] text-white transition-transform hover:scale-105 cursor-pointer overflow-hidden relative ${
                                                unit.status === true ? 'opacity-60' : ''
                                            }`}
                                            whileHover={{ scale: unit.status !== true ? 1.02 : 1 }}
                                            whileTap={{ scale: unit.status !== true ? 0.98 : 1 }}
                                        >
                                            <motion.button
                                                type="button"
                                                className={`flex flex-col h-full relative group ${unit.status === true ? 'grayscale' : ''}`}
                                                aria-label={`View lessons for ${unit.yunitnumber}`}
                                                onClick={() => {
                                                    setSelectedYunitData(unit);
                                                    setShowYunitLesson(true)
                                                }}
                                                disabled={unit.status === true}
                                            >
                                                <img
                                                    src={unit.imageurl}
                                                    alt={unit.yunitnumber}
                                                    className="absolute inset-0 w-full h-full object-cover z-0 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                                                />
                                                <div className="relative z-10 flex flex-col h-full justify-between p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                                                    <div>
                                                        <div className="text-2xl font-extrabold mb-1 drop-shadow-lg tracking-wide">Yunit {unit.yunitnumber}</div>
                                                        <div className="text-base font-medium opacity-95 mb-4 drop-shadow-sm tracking-wide">{unit.yunitname}</div>
                                                    </div>
                                                    {unit.status === false && 
                                                        <div className="flex items-center gap-2 mt-auto">
                                                            <span className={`text-xs font-semibold underline underline-offset-2 transition-colors ${
                                                                unit.status === true ? 'text-gray-300 cursor-not-allowed' : 'group-hover:text-blue-200'
                                                            }`}>
                                                                View Lessons
                                                            </span>
                                                            <ChevronRight size={18} />
                                                        </div>
                                                    }
                                                </div>
                                                <span
                                                    className={`absolute top-3 left-3 flex items-center justify-center w-8 h-8 rounded-full shadow-lg ring-2 ring-white
                                                        ${unit.isPersonal ? 'bg-green-500' : 'bg-blue-500'} text-white text-base font-bold transition-all duration-200`}
                                                    title={unit.isPersonal ? 'Personal Yunit' : 'Global Yunit'}
                                                >
                                                    {unit.isPersonal ? 'P' : 'G'}
                                                </span>
                                            </motion.button>
                                            {/* Popup for edit and delete */}
                                            {((role === 'Admin') || (role === 'Teacher' && unit.isPersonal === true)) && 
                                                <Popup
                                                    trigger={
                                                        (unit.status === false &&
                                                            <motion.button
                                                                title='Options'
                                                                aria-label="Options"
                                                                type='button'
                                                                className="absolute top-3 right-3 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-md shadow-lg cursor-pointer hover:bg-white/30 transition-colors duration-200"
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                tabIndex={0}
                                                            >
                                                                <EllipsisVertical size={20} color="white" />
                                                            </motion.button>
                                                        )
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
                                                                className='flex items-center px-6 py-4 gap-3 text-gray-700 hover:bg-gray-100 rounded transition text-base'
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setAction('edit');
                                                                    setSelectedYunitData(unit);
                                                                    setIsYunitModal(true);
                                                                    close();
                                                                }}
                                                            >
                                                                <SquarePen size={24} />
                                                                Edit yunit
                                                            </button>
                                                            <button
                                                                type='button'
                                                                className='flex items-center px-6 py-4 gap-3 text-red-500 hover:bg-red-50 rounded transition text-base'
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedYunit(unit.id);
                                                                    setIsDeleteModalOpen(true);
                                                                    close();
                                                                }}
                                                            >
                                                                <Trash2 size={24} />
                                                                Delete yunit
                                                            </button>
                                                        </motion.div>
                                                    )) as any}
                                                />
                                            }
                                            {unit.status === true && (
                                                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20">
                                                    <LockKeyhole size={48} className="text-white mb-2 animate-bounce" />
                                                    {/* <span className="text-white text-2xl font-bold animate-bounce">🔒</span> */}
                                                    <span className="text-white text-lg font-bold">Locked</span>
                                                    <span className="text-white text-xs mt-1">This yunit is currently locked.</span>
                                                    {((role === 'Admin') || (role === 'Teacher' && unit.isPersonal === true)) && 
                                                        <motion.button
                                                            className="flex mt-4 px-4 py-2 gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                            onClick={() => {
                                                                setIsUnlock(true);
                                                                handleUnlockYunit(unit.id, unit.yunitnumber, unit.yunitname, unit.imagepath, unit.imageurl)
                                                            }}
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            {isUnlock ?
                                                                <SpinLoadingWhite />
                                                            :
                                                                <LockKeyholeOpen size={20} className="inline-block" />
                                                            }
                                                            Unlock
                                                        </motion.button>
                                                    }
                                                </div>
                                            )}
                                        </motion.div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                )
            }
            {isYunitModal && (
                <div className={'fixed inset-0 bg-black/80 z-50 backdrop-blur-sm flex items-center justify-center overflow-hidden'}>
                    <YunitModal
                        action={action}
                        isOpen={isYunitModal}
                        onClose={() => setIsYunitModal(false)}
                        callFetchYunits= {() => fetchandSetYunits()}
                        classId={classId}
                        selectedYunit={selectedYunitData}
                    />
                </div>
            )}
            {isDeleteModalOpen && (
                <div className={'fixed inset-0 bg-black/80 z-50 backdrop-blur-sm flex items-center justify-center'}>
                    <DeleteModal
                        entityType="yunit"
                        isOpen={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
                        onDelete={async () => {
                            try {
                                {role === 'Admin' ?
                                    response = await doDeleteYunit(userId, selectedYunit) as any
                                :
                                    response = await doDeletePersonalYunit(userId, selectedYunit) as any;
                                }
                                if (response?.success) {
                                    toast.success(<CustomToast title="Yunit deleted!" subtitle="The yunit has been successfully deleted." />);
                                    fetchandSetYunits();
                                    setSelectedYunit('');
                                    setIsDeleteModalOpen(false);
                                } else {
                                    toast.error(<CustomToast title="Something went wrong!" subtitle="Failed to delete this yunit. Please try again." />);
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

export default MyCourses;