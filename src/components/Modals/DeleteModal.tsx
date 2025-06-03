import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SpinLoadingColored } from '../Icons/icons';

interface DeleteUserModalProps {
    entityType: "user" | "class" | "event" | "yunit";
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => Promise<void>;
}

const DeleteUserModal = ({ entityType, isOpen, onClose, onDelete }: DeleteUserModalProps) => {
      
    const [isDelete, setIsDelete] = useState(false);
    if (!isOpen) { return null; }

    return (
        <>  
            <motion.div
                className={`flex-1 max-w-md bg-white py-10 px-15 rounded-lg shadow-lg`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                transition={{
                    duration: 0.3,
                    scale: { type: "spring", visualDuration: 0.4, bounce: 0.4 },
                }}
            >
                {/* Modal content */}
                <div className="rounded-full bg-red-500 size-15 items-center justify-center mx-auto mb-4">
                    <motion.div
                        className='text-5xl font-bold text-white size-15 flex items-center justify-center mx-auto mb-4'
                        initial={{ scaleX: 1 }}
                        animate={{ scaleX: [1, -1, 1] }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                    >
                        !
                    </motion.div>
                </div>
                {/* I want to change if users or classess for deletion */}
                <h2 className="text-2xl font-bold text-center mb-4">
                    Are you sure you want to delete this {entityType}?
                </h2>
                <div className="flex justify-center gap-4 mt-4">
                    {isDelete ? (
                        <div className="flex items-center justify-center gap-2">
                            <SpinLoadingColored />
                            Deleting...
                        </div>
                    ): (
                        <>
                            <button
                                type='button'
                                className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                onClick={() => {
                                    onDelete();
                                    setIsDelete(true);
                                }}
                            >
                                Yes
                            </button>
                            <button
                                type='button'
                                className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                                onClick={onClose}
                            >
                                No
                            </button>
                        </>
                    )}
                </div>
                <p className="text-gray-600 text-xs text-center mt-4 py-2 px-8 bg-[#FBE6E6] rounded-sm shadow-sm drop-shadow-sm">
                    Warning: This action cannot be undone!
                </p>
            </motion.div>
        </>
    );
}

export default DeleteUserModal;