import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import salimbigkas from '../assets/sb-symbol.svg';
import Header from '../components/HomePage/Header';
import LoginModal from '../components/Modals/LoginModal';
import RegisterModal from '../components/Modals/RegisterModal';
import Footer from '../components/HomePage/Footer';

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
    <div className="flex flex-col mx-auto bg-white">
      <div className="w-full sticky top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1440px] mx-auto flex justify-center items-center">
          <Header 
            openHomePage={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            openAboutPage={() => document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' })}
            openFeaturesPage={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            openContactPage={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            openLoginModal={openLoginModal}  
          />
        </div>
      </div>
      <div className="w-full h-[600px] bg-gradient-to-b from-[#e0f2f1] via-[#e0f2f1]/80 to-[#ffffff] shadow-sm rounded-bl-4xl rounded-br-4xl border border-gray-200">
        <div className="max-w-[1440px] mx-auto flex h-full px-40 py-10 gap-10 justify-center items-center">
          <div className="flex flex-col h-full text-left justify-center items-start">
            <h1 className="text-7xl leading-[5rem] font-semibold">Tuklasin ang Galing sa Wikang Filipino!</h1>
            <h2 className="w-xl mt-5 text-xl font-medium">
              Isang makabagong plataporma para sa batang mag-aaral. <br />
              Matuto nang mas madali at mas matalino. Simulan ang iyong paglalakbay sa wika ngayon.
            </h2>
            <div className="flex flex-col mt-10">
              <button
                type="button"
                className="text-white text-[1.2rem] px-15 py-6 rounded-4xl shadow-sm drop-shadow-lg bg-[#2C3E50] hover:bg-[#34495e]"
              >
                Simulan ang Pag-aaral
              </button>
              <h2 className="mt-5 mb-5">
                Wala pang account?
                <a
                  className="cursor-pointer hover:underline ml-1 text-[#2C3E50] font-semibold"
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
            <img src={salimbigkas} alt="Sample Icon" className="size-150" />
          </div>
        </div>
      </div>
      <div id='features' className="w-full py-10">
        <div className="max-w-[1440px] mx-auto flex flex-col px-40 py-10 gap-5 justify-center items-center">
          <h1 className="text-3xl font-semibold">Why choose SalimBigkas?</h1>
          <h2 className=" text-gray-500 text-xl font-medium">Comprehensive learning tools designed for modern education</h2>
          <div className='flex w-full py-40 bg-white'>
            <motion.div
              className='flex w-full justify-between items-center transition duration-300 ease-in-out hover:-translate-y-2'
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <img
                src={salimbigkas}
                alt="Sample Icon"
                className="size-50"
              />
              <div className='flex flex-col text-left'>
                <h2 className='mt-5 text-5xl font-bold'>Adaptive Learning</h2>
                <p className='mt-5 text-xl text-gray-500'>Personalized learning paths for every child</p>
              </div>
            </motion.div>
          </div>
          <div className='flex w-full py-40 bg-white'>
            <motion.div 
                className='flex w-full justify-between items-center transition duration-300 ease-in-out hover:-translate-y-2'
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className='flex flex-col text-left'>
                  <h2 className='mt-5 text-5xl font-bold'>Kompletong Aralin</h2>
                  <p className='mt-5 text-xl text-gray-500'>Lessons aligned with K-12 Filipino curriculum</p>
                </div>
                <img
                  src={salimbigkas}
                  alt="Sample Icon"
                  className="size-50"
                />
              </motion.div>
          </div>
          <div className='flex w-full py-40 bg-white'>
            <motion.div 
                className='flex w-full justify-between items-center transition duration-300 ease-in-out hover:-translate-y-2'
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <img
                  src={salimbigkas}
                  alt="Sample Icon"
                  className="size-50"
                />
                <div className='flex flex-col text-left'>
                  <h2 className='mt-5 text-5xl font-bold'>Achievement Badges</h2>
                  <p className='mt-5 text-xl text-gray-500'>Motivate kids through milestones</p>
                </div>
              </motion.div>
          </div>
          <div className='flex w-full py-40 bg-white'>
            <motion.div 
                className='flex w-full justify-between items-center transition duration-300 ease-in-out hover:-translate-y-2'
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className='flex flex-col text-left'>
                  <h2 className='mt-5 text-5xl font-bold'>Anywhere, Anytime Access</h2>
                  <p className='mt-5 text-xl text-gray-500'>Learn via web or mobile</p>
                </div>
                <img
                  src={salimbigkas}
                  alt="Sample Icon"
                  className="size-50"
                />
              </motion.div>
          </div>
        </div>
      </div>
      <div id='contact' className="w-full h-[400px] bg-[#2C3E50] text-white">
        <div className="max-w-[1440px] mx-auto flex flex-col justify-center items-center h-full">
          <h1 className="text-4xl font-bold">Ready to Transform Filipino Learning?</h1>
          <h2 className="mt-5 text-white/50 text-xl font-medium">Join the Salimbigkas Community</h2>
          <button
            type="button"
            className="mt-10 px-10 py-5 font-bold text-black bg-white hover:bg-gray-200"
            onClick={openRegisterModal}
          >
            Get Started Free
          </button>
        </div>
      </div>
      <div className="w-full bg-white shadow-sm rounded-tl-4xl rounded-tr-4xl border border-gray-200">
        <div className="max-w-[1440px] mx-auto flex flex-col px-25 py-10 justify-center items-center">
          <Footer />
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm flex items-center justify-center">
          {isLogin ? (
            <LoginModal isOpen={isModalOpen} onClose={closeModal} onSwitch={openRegisterModal} />
          ) : (
            <RegisterModal isOpen={isModalOpen} onClose={closeModal} onSwitch={openLoginModal} />
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;