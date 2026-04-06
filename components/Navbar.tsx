import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Menu, X, Clock, LogIn, User, Settings, LogOut } from 'lucide-react';
import { Language, Translations, ViewState } from '../types';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle, signOutUser } from '../services/supabaseService';

interface NavbarProps {
  currentLang: Language;
  setLang: (lang: Language) => void;
  t: Translations['nav'];
  setView: (view: ViewState) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentLang, setLang, t, setView }) => {
  const { user, profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) setIsUserMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLangSelect = (lang: Language) => { setLang(lang); setIsOpen(false); setIsMobileMenuOpen(false); };
  const handleNavClick = (view: ViewState) => { setView(view); setIsMobileMenuOpen(false); setIsUserMenuOpen(false); };

  const handleSignIn = async () => {
    try { await signInWithGoogle(); } catch (e) { console.error(e); }
  };
  const handleSignOut = async () => {
    await signOutUser();
    setIsUserMenuOpen(false);
    setView('landing');
  };

  return (
    <nav className="glass-nav fixed top-0 w-full z-50 h-20 shadow-sm transition-all duration-300">
      <div className="flex items-center justify-between px-6 md:px-12 h-full">

        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleNavClick('landing')}>
          <div className="bg-white p-1.5 rounded-xl shadow-sm group-hover:shadow-md transition-all border border-gray-100">
            <Logo className="w-8 h-8" />
          </div>
          <span className="font-serif text-xl font-bold text-navy-900 tracking-tight">{t.brand}</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-600">
          <button onClick={() => setView('landing')} className="hover:text-navy-900 px-3 py-2 rounded-md hover:bg-gray-50 transition-all">{t.home}</button>
          <button onClick={() => setView('new-case')} className="hover:text-navy-900 px-3 py-2 rounded-md hover:bg-gray-50 transition-all">{t.newCase}</button>
          <button onClick={() => setView('about')} className="hover:text-navy-900 px-3 py-2 rounded-md hover:bg-gray-50 transition-all">{t.resources}</button>
          <button onClick={() => setView('history')} className="hover:text-navy-900 px-3 py-2 rounded-md hover:bg-gray-50 transition-all flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> {t.history}
          </button>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">

          {/* Language Selector */}
          <div className="relative group" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 text-gray-700 hover:text-navy-900 border border-gray-200 px-3 py-2 rounded-lg bg-white hover:border-gray-300 transition-all"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">
                {currentLang === 'uz_lat' ? "O'zbek" : currentLang === 'uz_cyr' ? "Ўзбек" : currentLang === 'ru' ? "Русский" : "English"}
              </span>
              <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
                <button onClick={() => handleLangSelect('uz_lat')} className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 ${currentLang === 'uz_lat' ? 'text-gold-600 font-bold bg-gray-50' : 'text-gray-700'}`}>O'zbek (Lotin)</button>
                <button onClick={() => handleLangSelect('uz_cyr')} className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 ${currentLang === 'uz_cyr' ? 'text-gold-600 font-bold bg-gray-50' : 'text-gray-700'}`}>Ўзбек (Кирилл)</button>
                <button onClick={() => handleLangSelect('ru')} className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 ${currentLang === 'ru' ? 'text-gold-600 font-bold bg-gray-50' : 'text-gray-700'}`}>Русский</button>
                <button onClick={() => handleLangSelect('en')} className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 ${currentLang === 'en' ? 'text-gold-600 font-bold bg-gray-50' : 'text-gray-700'}`}>English</button>
              </div>
            )}
          </div>

          {/* Auth Button / User Menu */}
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 border border-gray-200 px-2 py-1.5 rounded-xl bg-white hover:border-navy-300 transition-all"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="avatar" className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-navy-900 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <span className="hidden sm:inline text-sm font-medium text-navy-900 max-w-[120px] truncate">
                  {profile?.displayName || user.displayName || t.myProfile}
                </span>
                <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <p className="text-xs font-bold text-navy-900 truncate">{profile?.displayName || user.displayName}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                  <button onClick={() => handleNavClick('profile')} className="flex items-center gap-2.5 w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <User className="w-4 h-4 text-gray-400" /> {t.myProfile}
                  </button>
                  <button onClick={() => handleNavClick('settings')} className="flex items-center gap-2.5 w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <Settings className="w-4 h-4 text-gray-400" /> {t.settings}
                  </button>
                  <div className="border-t border-gray-100" />
                  <button onClick={handleSignOut} className="flex items-center gap-2.5 w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut className="w-4 h-4" /> {t.signOut}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              className="hidden sm:flex items-center gap-2 bg-navy-900 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-navy-800 transition-all shadow-sm"
            >
              <LogIn className="w-4 h-4" /> {t.signIn}
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-navy-900 hover:bg-gray-100 rounded-lg transition-colors z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed inset-0 top-20 z-40 transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        <div className="absolute inset-0 bg-navy-900/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        <div className={`relative bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-xl transition-all duration-300 ease-out transform ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
          <div className="flex flex-col p-4 space-y-2">
            <button onClick={() => handleNavClick('landing')} className="p-4 rounded-xl hover:bg-navy-50 text-left font-medium text-gray-700 hover:text-navy-900 transition-all">{t.home}</button>
            <button onClick={() => handleNavClick('new-case')} className="p-4 rounded-xl bg-gold-50 text-gold-700 hover:bg-gold-100 text-left font-bold transition-all border border-gold-100">{t.newCase}</button>
            <button onClick={() => handleNavClick('about')} className="p-4 rounded-xl hover:bg-navy-50 text-left font-medium text-gray-700 hover:text-navy-900 transition-all">{t.resources}</button>
            <button onClick={() => handleNavClick('history')} className="p-4 rounded-xl hover:bg-navy-50 text-left font-medium text-gray-700 hover:text-navy-900 transition-all flex items-center gap-2">
              <Clock className="w-4 h-4" /> {t.history}
            </button>
            {user ? (
              <>
                <button onClick={() => handleNavClick('profile')} className="p-4 rounded-xl hover:bg-navy-50 text-left font-medium text-gray-700 transition-all flex items-center gap-2">
                  <User className="w-4 h-4" /> Profile
                </button>
                <button onClick={handleSignOut} className="p-4 rounded-xl hover:bg-red-50 text-left font-medium text-red-600 transition-all flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <button onClick={handleSignIn} className="p-4 rounded-xl bg-navy-900 text-white text-left font-bold transition-all flex items-center gap-2">
                <LogIn className="w-4 h-4" /> Sign In with Google
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
