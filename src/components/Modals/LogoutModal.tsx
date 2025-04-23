import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { doSignOut } from '../../firebase/auth';

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LogoutModal = ({ isOpen, onClose }: LogoutModalProps) => {

    const navigate = useNavigate();

    const handleLogout = () => {
        setTimeout(() => {
          doSignOut()
            .then(() => {
                navigate("/home");
            })
            .catch((error) => {
              console.error("Error signing out:", error);
            });
        }, 100);
    };
      
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
                        ?
                    </motion.div>
                </div>
                
                <h2 className="text-lg font-semibold text-center mb-4">Are you sure you want to log out?</h2>
                <div className="flex justify-center gap-4 mt-4">
                    <button
                        type='button'
                        className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={handleLogout}
                    >
                        Yes
                    </button>
                    <button
                        type='button'
                        className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                        onClick={onClose}
                    >
                        No
                    </button>
                </div>
            </motion.div>
        </>
    );
}

export default LogoutModal;