import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Menu, X, Info } from 'lucide-react';
import { Language, Translations, ViewState } from '../types';
import Logo from './Logo';

interface NavbarProps {
  currentLang: Language;
  setLang: (lang: Language) => void;
  t: Translations['nav'];
  setView: (view: ViewState) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentLang, setLang, t, setView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLangSelect = (lang: Language) => {
    setLang(lang);
    setIsOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (view: ViewState) => {
    setView(view);
    setIsMobileMenuOpen(false);
  }

  // Helper tooltip component for Lang Selector
  const LangTooltip = () => (
    <div className="absolute top-full right-0 mt-3 w-48 p-2 bg-navy-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center">
      {t.langTooltip}
      <div className="absolute bottom-full right-8 -mb-1 border-4 border-transparent border-b-navy-900"></div>
    </div>
  );

  return (
    <nav className="glass-nav fixed top-0 w-full z-50 h-20 shadow-sm transition-all duration-300">
      <div className="flex items-center justify-between px-6 md:px-12 h-full">
          {/* Brand - Left */}
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => handleNavClick('landing')}
          >
            <div className="bg-white p-1.5 rounded-xl shadow-sm group-hover:shadow-md transition-all border border-gray-100">
                <Logo className="w-8 h-8" />
            </div>
            <span className="font-serif text-xl font-bold text-navy-900 tracking-tight">
              {t.brand}
            </span>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-600">
              <button 
                onClick={() => setView('landing')} 
                className="hover:text-navy-900 px-3 py-2 rounded-md hover:bg-gray-50 transition-all"
              >
                {t.home}
              </button>
              
              <button 
                onClick={() => setView('new-case')}
                className="hover:text-navy-900 px-3 py-2 rounded-md hover:bg-gray-50 transition-all"
              >
                {t.newCase}
              </button>

              <button 
                onClick={() => setView('about')} 
                className="hover:text-navy-900 px-3 py-2 rounded-md hover:bg-gray-50 transition-all"
              >
                {t.resources}
              </button>
          </div>

          {/* Language & Mobile Toggle - Right */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative group" ref={dropdownRef}>
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-gray-700 hover:text-navy-900 border border-gray-200 px-3 py-2 rounded-lg bg-white hover:border-gray-300 transition-all"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">
                  {currentLang === 'uz_lat' ? "O'zbek" : 
                   currentLang === 'uz_cyr' ? "Ўзбек" : 
                   currentLang === 'ru' ? "Русский" : "English"}
                </span>
                <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <LangTooltip />
              
              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden fade-in-up origin-top-right z-50">
                  <button onClick={() => handleLangSelect('uz_lat')} className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 ${currentLang === 'uz_lat' ? 'text-gold-600 font-bold bg-gray-50' : 'text-gray-700'}`}>O'zbek (Lotin)</button>
                  <button onClick={() => handleLangSelect('uz_cyr')} className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 ${currentLang === 'uz_cyr' ? 'text-gold-600 font-bold bg-gray-50' : 'text-gray-700'}`}>Ўзбек (Кирилл)</button>
                  <button onClick={() => handleLangSelect('ru')} className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 ${currentLang === 'ru' ? 'text-gold-600 font-bold bg-gray-50' : 'text-gray-700'}`}>Русский</button>
                  <button onClick={() => handleLangSelect('en')} className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 ${currentLang === 'en' ? 'text-gold-600 font-bold bg-gray-50' : 'text-gray-700'}`}>English</button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
                className="md:hidden p-2 text-gray-600 hover:text-navy-900 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-xl fade-in-up">
            <div className="flex flex-col p-4 space-y-2">
                <button 
                    onClick={() => handleNavClick('landing')} 
                    className="p-4 rounded-xl hover:bg-navy-50 text-left font-medium text-gray-700 hover:text-navy-900 transition-all flex items-center justify-between"
                >
                    {t.home}
                </button>
                <button 
                    onClick={() => handleNavClick('new-case')}
                    className="p-4 rounded-xl bg-gold-50 text-gold-700 hover:bg-gold-100 text-left font-bold transition-all flex items-center justify-between border border-gold-100"
                >
                    {t.newCase}
                </button>
                <button 
                    onClick={() => handleNavClick('about')} 
                    className="p-4 rounded-xl hover:bg-navy-50 text-left font-medium text-gray-700 hover:text-navy-900 transition-all flex items-center justify-between"
                >
                    {t.resources}
                </button>
            </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;