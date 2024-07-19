import React, { useState, useContext } from 'react';
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { LanguageContext } from '../contexts/LanguageContext';
import labelsData from '../../public/labels.json';
import AR from '../assets/SA.png'
import FR from '../assets/FR.png'
import UK from '../assets/GB.png'
import ES from '../assets/ES.png'
import RU from '../assets/RU.png'
import JA from '../assets/JP.png'
const LanguageDropdown = () => {
    const { language, changeLanguage } = useContext(LanguageContext);
    const [isOpen, setIsOpen] = useState(false);
    return <div className="relative flex flex-col items-center w-[150px] m-2">
        <button onClick={() => setIsOpen((prev) => !prev)} className='bg-white p-2 w-full flex items-center justify-between
    font-bold text-l rounded-lg tracking-wider border-4 border-transparent active:border-white
    duration-300 active:text-white'>
          
            {language === 'ar' ? (<img className='h-[20px] w-[30px]' src={AR} alt="" />) :
                language === 'fr' ? (<img className='h-[20px] w-[30px]' src={FR} alt="" />) :
                language === 'en' ? (<img className='h-[20px] w-[30px]' src={UK} alt="" />) :
                language === 'es' ? (<img className='h-[20px] w-[30px]' src={ES} alt="" />) :
                language === 'ru' ? (<img className='h-[20px] w-[30px]' src={RU} alt="" />) :
                    (<img className='h-[20px] w-[30px]' src={JA} alt="" />)
            }
            {labelsData.languageLabel[language]}
            {!isOpen ? (<IoMdArrowDropdown />) : (<IoMdArrowDropup />)}
        </button>
        {
            isOpen && (
                <div className='bg-white absolute top-[50px] flex flex-col items-start rounded-lg p-1 w-full shadow-lg'>
                    <div onClick={() => {
                        changeLanguage('ar');
                        setIsOpen(false);
                    }} className='flex w-full items-center justify-between px-2 hover:bg-gray-300 cursor-pointer rounded-l border-l-transparent'>
                        <h3>العربية</h3>
                        <img className='h-[20px] w-[30px]' src={AR} alt="" />
                    </div>
                    <div onClick={() => {
                        changeLanguage('fr');
                        setIsOpen(false);
                    }} className='flex w-full items-center justify-between px-2 hover:bg-gray-300 cursor-pointer rounded-l border-l-transparent'>
                        <h3>Français</h3>
                        <img className='h-[20px] w-[30px]' src={FR} alt="" />
                    </div>
                    <div onClick={() => {
                        changeLanguage('en');
                        setIsOpen(false);
                    }} className='flex w-full items-center justify-between px-2 hover:bg-gray-300 cursor-pointer rounded-l border-l-transparent'>
                        <h3>
                            English
                        </h3>
                        <img className='h-[20px] w-[30px]' src={UK} alt="" />
                    </div>
                    <div onClick={() => {
                        changeLanguage('es');
                        setIsOpen(false);
                    }} className='flex w-full items-center justify-between px-2 hover:bg-gray-300 cursor-pointer rounded-l border-l-transparent'>
                        <h3>
                        Español
                        </h3>
                        <img className='h-[20px] w-[30px]' src={ES} alt="" />
                    </div>
                    <div onClick={() => {
                        changeLanguage('ru');
                        setIsOpen(false);
                    }} className='flex w-full items-center justify-between px-2 hover:bg-gray-300 cursor-pointer rounded-l border-l-transparent'>
                        <h3>
                        Русский
                        </h3>
                        <img className='h-[20px] w-[30px]' src={RU} alt="" />
                    </div>
                    <div onClick={() => {
                        changeLanguage('ja');
                        setIsOpen(false);
                    }} className='flex w-full items-center justify-between px-2 hover:bg-gray-300 cursor-pointer rounded-l border-l-transparent'>
                        <h3>
                        日本語
                        </h3>
                        <img className='h-[20px] w-[30px]' src={JA} alt="" />
                    </div>
                </div>
            )
        }
    </div>
        ;
};

export default LanguageDropdown;