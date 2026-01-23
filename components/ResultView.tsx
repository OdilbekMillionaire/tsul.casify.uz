import React, { useState } from 'react';
import { LegalMemo, CaseData, Translations, ViewState, Language } from '../types';
import { Printer, Copy, RefreshCw, AlertTriangle, CheckSquare, Briefcase, FileText, Check, Loader2, Link2, ExternalLink, Bot, Gavel, X } from 'lucide-react';
import { LEGAL_AREA_TRANSLATIONS } from '../constants';

interface ResultViewProps {
  memo: LegalMemo;
  caseData: CaseData;
  t: Translations['result'];
  setView: (view: ViewState) => void;
  lang: Language;
}

const ResultView: React.FC<ResultViewProps> = ({ memo, caseData, t, setView, lang }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [printStatus, setPrintStatus] = useState<'idle' | 'preparing'>('idle');
  const [isWidgetVisible, setIsWidgetVisible] = useState(true);

  // Use the passed lang prop to display the translated Legal Area label
  const displayArea = LEGAL_AREA_TRANSLATIONS[lang]?.[caseData.area] || caseData.area;

  // Format date based on language locale
  const localeMap: Record<Language, string> = {
      'uz_lat': 'uz-UZ',
      'uz_cyr': 'uz-UZ',
      'ru': 'ru-RU',
      'en': 'en-US'
  };
  const formattedDate = new Date().toLocaleDateString(localeMap[lang]);

  const handlePrint = () => {
    setPrintStatus('preparing');
    // Small delay to allow state update to render (providing feedback) before print dialog freezes UI
    setTimeout(() => {
        window.print();
        setPrintStatus('idle');
    }, 500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(memo, null, 2));
    setCopyStatus('copied');
    setTimeout(() => setCopyStatus('idle'), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen pt-20 pb-12 px-4 gap-8 container mx-auto fade-in-up relative">
      
      {/* Sidebar - Metadata */}
      <aside className="lg:w-1/4 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-24">
            <h3 className="font-serif text-lg font-bold text-navy-900 mb-4 border-b pb-2">Case Metadata</h3>
            <div className="space-y-4 text-sm">
                <div>
                    <span className="block text-gray-500 text-xs uppercase tracking-wide">Title</span>
                    <span className="font-medium text-gray-900">{caseData.title}</span>
                </div>
                <div>
                    <span className="block text-gray-500 text-xs uppercase tracking-wide">Jurisdiction</span>
                    <span className="font-medium text-gray-900">{caseData.jurisdiction}</span>
                </div>
                <div>
                    <span className="block text-gray-500 text-xs uppercase tracking-wide">Area</span>
                    <span className="inline-block bg-navy-50 text-navy-800 px-2 py-0.5 rounded text-xs font-semibold mt-1">
                        {displayArea}
                    </span>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3">
                <button 
                    onClick={handleCopy} 
                    disabled={copyStatus === 'copied'}
                    className={`flex items-center gap-2 transition-all text-sm font-medium p-2 rounded-lg border ${
                        copyStatus === 'copied' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'text-gray-600 hover:text-navy-900 border-transparent hover:bg-gray-50'
                    }`}
                >
                    {copyStatus === 'copied' ? (
                        <>
                            <Check className="w-4 h-4" /> {t.copySuccess}
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4" /> {t.copyBtn}
                        </>
                    )}
                </button>

                <button 
                    onClick={handlePrint} 
                    disabled={printStatus === 'preparing'}
                    className="flex items-center gap-2 text-gray-600 hover:text-navy-900 transition-colors text-sm font-medium p-2 rounded-lg hover:bg-gray-50"
                >
                    {printStatus === 'preparing' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Printer className="w-4 h-4" />
                    )}
                    {printStatus === 'preparing' ? t.printPreparing : t.printBtn}
                </button>

                <button onClick={() => setView('new-case')} className="flex items-center gap-2 text-gold-600 hover:text-gold-700 transition-colors text-sm font-bold mt-2 p-2">
                    <RefreshCw className="w-4 h-4" /> {t.newCaseBtn}
                </button>
            </div>
        </div>
      </aside>

      {/* Main Content - Document */}
      <main className="lg:w-3/4">
        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden print:shadow-none print:border-none">
            {/* Document Header */}
            <div className="bg-navy-900 text-white p-8 md:p-12 text-center print:bg-white print:text-black">
                <div className="flex items-center justify-center gap-2 mb-4 opacity-75">
                    <ScaleIcon className="w-8 h-8 text-gold-500" />
                    <span className="font-serif tracking-widest uppercase text-sm">{t.privileged}</span>
                </div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">{memo.title}</h1>
                <p className="text-gray-300 max-w-2xl mx-auto italic print:text-gray-600">{t.generatedBy} • {formattedDate}</p>
            </div>

            <div className="p-8 md:p-12 space-y-10">
                
                {/* Executive Summary */}
                <section>
                    <h2 className="flex items-center gap-3 font-serif text-2xl font-bold text-navy-900 mb-4">
                        <Briefcase className="w-6 h-6 text-gold-500" />
                        {t.summaryHeader}
                    </h2>
                    <div className="bg-slate-50 p-6 rounded-lg border-l-4 border-gold-500 text-gray-700 leading-relaxed text-lg">
                        {memo.summary}
                    </div>
                </section>

                {/* Facts & Issues */}
                <section>
                    <h2 className="flex items-center gap-3 font-serif text-2xl font-bold text-navy-900 mb-4">
                        <FileText className="w-6 h-6 text-gold-500" />
                        {t.factsHeader}
                    </h2>
                    <div className="mb-4">
                        <h4 className="font-bold text-gray-900 mb-2 uppercase text-xs tracking-wide">Key Issues Identified:</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {memo.issues.map((issue, idx) => (
                                <li key={idx} className="font-medium">{issue}</li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* IRAC Analysis */}
                <section>
                    <h2 className="flex items-center gap-3 font-serif text-2xl font-bold text-navy-900 mb-6">
                        <ScaleIcon className="w-6 h-6 text-gold-500" />
                        {t.analysisHeader}
                    </h2>
                    <div className="space-y-8">
                        {memo.iracAnalysis.map((item, idx) => (
                            <div key={idx} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                <h3 className="font-bold text-navy-900 text-lg mb-3">Issue {idx + 1}: {item.issue}</h3>
                                <div className="space-y-3 text-gray-700">
                                    <p><strong className="text-gold-600 font-serif">Rule:</strong> {item.rule}</p>
                                    <p><strong className="text-navy-700 font-serif">Application:</strong> {item.application}</p>
                                    <p className="bg-gray-50 p-3 rounded mt-2"><strong className="text-navy-900 font-serif">Conclusion:</strong> {item.conclusion}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Legal Resolution / Outcome (Conditionally Rendered) */}
                {memo.resolution && memo.resolution.trim() !== "" && (
                     <section className="bg-navy-900 text-white p-8 rounded-xl shadow-lg border border-navy-800">
                        <h2 className="flex items-center gap-3 font-serif text-2xl font-bold mb-4 text-gold-500">
                            <Gavel className="w-6 h-6" />
                            Court Resolution / Outcome
                        </h2>
                        <div className="text-gray-200 leading-relaxed text-lg italic border-l-4 border-gold-500 pl-4">
                            "{memo.resolution}"
                        </div>
                    </section>
                )}

                {/* Risks & Evidence Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section>
                        <h2 className="flex items-center gap-3 font-serif text-xl font-bold text-navy-900 mb-4">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            {t.risksHeader}
                        </h2>
                        <ul className="space-y-2">
                            {memo.risks.map((risk, idx) => (
                                <li key={idx} className="flex gap-2 text-gray-700 text-sm">
                                    <span className="text-red-500">•</span> {risk}
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 className="flex items-center gap-3 font-serif text-xl font-bold text-navy-900 mb-4">
                            <CheckSquare className="w-5 h-5 text-green-600" />
                            {t.evidenceHeader}
                        </h2>
                        <ul className="space-y-2">
                            {memo.evidenceChecklist.map((item, idx) => (
                                <li key={idx} className="flex gap-2 text-gray-700 text-sm">
                                    <input type="checkbox" className="mt-1 rounded text-gold-500 focus:ring-gold-500" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                 {/* Next Steps */}
                 <section className="bg-navy-50 rounded-xl p-8 border border-navy-100">
                    <h2 className="font-serif text-xl font-bold text-navy-900 mb-4">{t.stepsHeader}</h2>
                    <ol className="list-decimal list-inside space-y-3">
                         {memo.nextSteps.map((step, idx) => (
                            <li key={idx} className="text-gray-800 font-medium pl-2">{step}</li>
                        ))}
                    </ol>
                </section>
                
                {/* Sources / References - SEARCH RESULTS */}
                {memo.sources && memo.sources.length > 0 && (
                  <section className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                     <h2 className="flex items-center gap-3 font-serif text-xl font-bold text-navy-900 mb-6">
                        <Link2 className="w-5 h-5 text-blue-600" />
                        {t.sourcesHeader}
                     </h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {memo.sources.map((source, idx) => (
                           <a 
                              key={idx} 
                              href={source.uri} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 transition-all group"
                           >
                              <div className="bg-white p-2 rounded-full border border-gray-200 group-hover:border-blue-100 flex-shrink-0">
                                 <GlobeIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                              </div>
                              <div className="flex-grow">
                                 <h4 className="font-medium text-navy-900 group-hover:text-blue-700 text-sm line-clamp-2 leading-snug">
                                    {source.title}
                                 </h4>
                                 <span className="text-xs text-gray-500 flex items-center gap-1 mt-1 truncate max-w-[200px]">
                                    {new URL(source.uri).hostname}
                                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                 </span>
                              </div>
                           </a>
                        ))}
                     </div>
                  </section>
                )}

                {/* Disclaimer */}
                <footer className="pt-8 border-t border-gray-200">
                    <p className="text-xs text-gray-400 text-center uppercase tracking-wider">
                        Disclaimer: {memo.disclaimer}
                    </p>
                </footer>
            </div>
        </div>
      </main>
      
      {/* Floating Practice AI Widget */}
      {isWidgetVisible && (
          <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 animate-in slide-in-from-bottom-4 fade-in duration-500">
            {/* Chat Bubble */}
            <div className="bg-white p-4 rounded-2xl rounded-tr-sm shadow-2xl border border-gray-200 max-w-xs mb-2 relative">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-gold-500" />
                    </div>
                    <div>
                        <h4 className="font-bold text-navy-900 text-sm">{t.practiceAi.title}</h4>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                             "{t.practiceAi.greeting}"
                        </p>
                    </div>
                    <button 
                        onClick={() => setIsWidgetVisible(false)} 
                        className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md border border-gray-100 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Close widget"
                    >
                        <X size={14}/>
                    </button>
                </div>
            </div>
             {/* The "Anchor" Button (Just visual or re-opens if we had minimize logic, for now it's part of the group) */}
             <div className="w-14 h-14 bg-navy-900 rounded-full shadow-lg flex items-center justify-center border-4 border-white cursor-pointer hover:bg-navy-800 transition-colors">
                <Bot className="w-7 h-7 text-gold-500" />
             </div>
          </div>
      )}

    </div>
  );
};

// Quick helper icon components
const ScaleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
    </svg>
);

const GlobeIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
    </svg>
);

export default ResultView;