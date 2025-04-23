import { useState } from 'react';
import man from '../assets/man.svg';
import woman from '../assets/woman.svg';
import Header from '../components/HomePage/Header';
import LoginModal from '../components/Modals/LoginModal';
import RegisterModal from '../components/Modals/RegisterModal';
import { motion } from "framer-motion";

const HomePage=()=> {
    
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const openLoginModal = () => {
    setIsModalOpen(true);
    setIsLogin(true);
  };

  const openRegisterModal = () => {
    setIsModalOpen(true);
    setIsLogin(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <motion.div
      className="flex flex-wrap mx-auto bg-[#2C3E50]"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Header openLoginModal={openLoginModal} />
      <motion.div
        className="flex w-full bg-white px-20 p-4 shadow-lg rounded-bl-4xl rounded-br-4xl text-left justify-between items-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex flex-col mt-5">
          <h1 className="text-5xl leading-[3.5rem] font-semibold">
            Maligayang Pagdating sa SalimBigkas!
          </h1>
          <h2 className="mt-5 text-xl font-medium">
            Matuto ng Filipino nang Mas Madali at Mas Matalino!
          </h2>
          <motion.button
            className="mt-10 w-60 text-white text-lg px-4 py-4 rounded-4xl shadow-md drop-shadow-lg bg-[#2C3E50] hover:bg-[#34495e]"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Simulan ang Pag-aaral
          </motion.button>
          <h2 className="mt-5 mb-5">
            Wala pang account?{" "}
            <a href="#" onClick={openRegisterModal}>
              Magrehistro!
            </a>
          </h2>
        </div>
        <div className="flex right-0 top-0">
          <motion.img
            src={man}
            alt="Sample Icon"
            className="w-auto h-auto absolute top-30 right-60"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          <motion.img
            src={woman}
            alt="Sample Icon"
            className="w-auto h-auto absolute top-30 right-15"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </motion.div>
      {isModalOpen && (
        <motion.div
          className={
            "fixed inset-0 bg-black/80 z-50 backdrop-blur-sm flex items-center justify-center"
          }
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {isLogin ? (
            <LoginModal
              isOpen={isModalOpen}
              onClose={closeModal}
              onSwitch={openRegisterModal}
            />
          ) : (
            <RegisterModal
              isOpen={isModalOpen}
              onClose={closeModal}
              onSwitch={openLoginModal}
            />
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default HomePage;

<div className="flex max-w-[1440px] w-full h-full px-40 py-10 gap-10 justify-center items-center">
          <div className="flex flex-col h-full justify-center items-start">
            <h1 className='text-7xl leading-[5rem] font-semibold'>Tuklasin ang Galing sa Wikang Filipino!</h1>
            <h2 className='w-xl mt-5 text-xl font-medium'>Isang makabagong plataporma para sa batang mag-aaral. <br />Matuto nang mas madali at mas matalino. Simulan ang iyong paglalakbay sa wika ngayon.</h2>
            <div className='flex flex-col mt-10'>
              <button type='button' className='text-white text-[1.2rem] px-15 py-6 rounded-4xl shadow-sm drop-shadow-lg bg-[#2C3E50] hover:bg-[#34495e]'>Simulan ang Pag-aaral</button>
              <h2 className='mt-5 mb-5'>
                Wala pang account? 
                <a 
                  className='cursor-pointer hover:underline ml-1 text-[#2C3E50] font-semibold' 
                  href="/register"  
                  onClick={(e) => {
                    e.preventDefault();
                    openRegisterModal();
                  }}
                >
                  Magrehistro!
                </a>
              </h2>
            </div>
          </div>
          <div className="flex h-full justify-center items-center">
            <img
              src={salimbigkas}
              alt="Sample Icon"
              className="size-150"
            />
          </div>
        </div>