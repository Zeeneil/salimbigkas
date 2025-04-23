// import { useState, useEffect } from 'react';
import salimbigkas from '../../assets/salimbigkas-poppins.svg';

interface HeaderProps {
  openLoginModal: () => void;
  openHomePage: () => void;
  openAboutPage: () => void;
  openFeaturesPage: () => void;
  openContactPage: () => void;
}

const Header = ({ openLoginModal, openHomePage, openAboutPage, openFeaturesPage, openContactPage }: HeaderProps) => {

  // const [isDarkMode, setIsDarkMode] = useState(false);

  // useEffect(() => {
  //   const savedTheme = localStorage.getItem('theme');
  //   if (savedTheme) {
  //     setIsDarkMode(savedTheme === 'dark');
  //     document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  //   } else {
  //     const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  //     setIsDarkMode(userPrefersDark);
  //     document.documentElement.classList.toggle('dark', userPrefersDark);
  //   }
  // }, []);

  // Dark mode toggle logic can be added back if needed in the future

  return (
    <header className="flex bg-white max-w-[1440px] w-full px-20 py-2">
      <div className='container mx-auto flex justify-between items-center'>
        <img
          src={salimbigkas}
          alt="Salimbigkas Logo"
          className="w-40"
        />
      </div>
      <div className='flex items-center justify-center w-full'>
        <ul className="flex gap-10 text-sm font-semibold">
          <li><a className='cursor-pointer' target="_blank" rel="noopener noreferrer" onClick={openHomePage}>Home</a></li>
          <li><a className='cursor-pointer' target="_blank" rel="noopener noreferrer" onClick={openAboutPage}>About</a></li>
          <li><a className='cursor-pointer' target="_blank" rel="noopener noreferrer" onClick={openFeaturesPage}>Features</a></li>
          <li><a className='cursor-pointer' target="_blank" rel="noopener noreferrer" onClick={openContactPage}>Contact</a></li>
        </ul>
      </div>
      <div className="flex items-center justify-center w-full">
        <button 
          type='button' 
          className="ml-auto text-black text-base px-4 py-2 rounded-lg border hover:border-[#e0f2f1] shadow-md drop-shadow-lg bg-none hover:bg-[#e0f2f1]" 
          onClick={openLoginModal}
        >
          Mag-Login
        </button>
      </div>
      {/* <button
        className="ml-4 text-black hover:text-white text-base px-4 py-2 rounded-lg border-2 bg-none hover:bg-[#34495e] dark:text-white dark:hover:bg-gray-600"
        onClick={toggleDarkMode}
      >
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button> */}
    </header>
  );
};

export default Header;