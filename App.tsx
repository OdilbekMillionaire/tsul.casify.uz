import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import CaseForm from './components/CaseForm';
import ResultView from './components/ResultView';
import AboutPage from './components/AboutPage';
import Logo from './components/Logo';
import { generateLegalMemo } from './services/geminiService';
import { INITIAL_CASE_DATA, TRANSLATIONS } from './constants';
import { CaseData, Language, LegalMemo, ViewState } from './types';
import SplineRobot from './components/SplineRobot';


function App() {
  const [currentLang, setCurrentLang] = useState<Language>('uz_lat');
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [caseData, setCaseData] = useState<CaseData>(INITIAL_CASE_DATA);
  const [memo, setMemo] = useState<LegalMemo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load persisted state on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('casify_lang') as Language;
    if (savedLang && TRANSLATIONS[savedLang]) {
      setCurrentLang(savedLang);
    }

    const savedForm = localStorage.getItem('casify_form_state');
    if (savedForm) {
      try {
        setCaseData(JSON.parse(savedForm));
      } catch (e) {
        console.error("Failed to load saved form state");
      }
    }
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem('casify_lang', lang);
  };

  const handleCaseSubmit = async (data: CaseData) => {
    setIsLoading(true);
    setCaseData(data); // Ensure state is synced
    try {
      const result = await generateLegalMemo(data, currentLang);
      setMemo(result);
      setCurrentView('result');
    } catch (error) {
      alert("Error generating memorandum. Please check your connection or API limit.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderView = () => {
    const t = TRANSLATIONS[currentLang];

    switch (currentView) {
      case 'landing':
        return <LandingPage t={t} setView={setCurrentView} />;
      case 'new-case':
        return <CaseForm t={t.form} initialData={caseData} onSubmit={handleCaseSubmit} isLoading={isLoading} lang={currentLang} />;
      case 'result':
        if (!memo) return <LandingPage t={t} setView={setCurrentView} />; // Fallback
        return <ResultView memo={memo} caseData={caseData} t={t.result} setView={setCurrentView} lang={currentLang} />;
      case 'about':
        return <AboutPage t={t.about} />;
      default:
        return <LandingPage t={t} setView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-navy-900 pb-0 flex flex-col">
      <Navbar
        currentLang={currentLang}
        setLang={handleLanguageChange}
        t={TRANSLATIONS[currentLang].nav}
        setView={setCurrentView}
      />

      <SplineRobot />
      <div className="pt-16 flex-grow">
        {renderView()}
      </div>

      {/* Professional Footer */}
      <footer className="bg-navy-900 text-white mt-auto pt-16 pb-8 border-t border-navy-800">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

            {/* Brand Column */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/10">
                  <Logo className="w-6 h-6" />
                </div>
                <span className="font-serif text-xl font-bold tracking-tight text-white">
                  {TRANSLATIONS[currentLang].nav.brand}
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {TRANSLATIONS[currentLang].about.tagline}
              </p>
            </div>

            {/* Links Column 1 */}
            <div>
              <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-wider opacity-80">
                {TRANSLATIONS[currentLang].footer.platformHeader}
              </h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><button onClick={() => setCurrentView('landing')} className="hover:text-gold-500 transition-colors text-left">{TRANSLATIONS[currentLang].nav.home}</button></li>
                <li><button onClick={() => setCurrentView('new-case')} className="hover:text-gold-500 transition-colors text-left">{TRANSLATIONS[currentLang].nav.newCase}</button></li>
                <li><button onClick={() => setCurrentView('about')} className="hover:text-gold-500 transition-colors text-left">{TRANSLATIONS[currentLang].nav.resources}</button></li>
              </ul>
            </div>

            {/* Links Column 2 */}
            <div className="col-span-1 md:col-span-2">
              <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-wider opacity-80">
                {TRANSLATIONS[currentLang].footer.disclaimerHeader}
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-gold-500 pl-4">
                {TRANSLATIONS[currentLang].footer.disclaimer}
              </p>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-navy-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs">
              {TRANSLATIONS[currentLang].footer.copyright}
            </p>
            <div className="flex gap-6 text-xs text-gray-500">
              <button className="hover:text-white transition-colors">{TRANSLATIONS[currentLang].footer.links.privacy}</button>
              <button className="hover:text-white transition-colors">{TRANSLATIONS[currentLang].footer.links.terms}</button>
              <button className="hover:text-white transition-colors">{TRANSLATIONS[currentLang].footer.links.contact}</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;