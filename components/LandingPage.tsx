import React, { useState, useEffect } from 'react';
import { ArrowRight, BookOpen, ShieldCheck, Globe2, Scale, Lock, GraduationCap, PenTool, Cpu } from 'lucide-react';
import { Translations, ViewState } from '../types';

interface LandingPageProps {
  t: Translations;
  setView: (view: ViewState) => void;
}

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop", // 1. Classical University (TSUL vibe)
  "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2070&auto=format&fit=crop", // 2. Law/Justice (Gavel & Scales)
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2070&auto=format&fit=crop", // 3. AI/Tech (Abstract Nodes)
  "https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=2070&auto=format&fit=crop", // 4. Library/Academic Research
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2032&auto=format&fit=crop"  // 5. Professional/Modern Meeting
];

const LandingPage: React.FC<LandingPageProps> = ({ t, setView }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      
      {/* HERO SECTION */}
      <section className="relative h-[650px] md:h-[750px] flex items-center overflow-hidden">
        
        {/* Carousel Backgrounds */}
        {HERO_IMAGES.map((img, index) => (
            <div 
                key={index}
                className={`absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                    index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ backgroundImage: `url("${img}")` }}
            />
        ))}
        
        {/* Heavy Gradient Overlay - Navy to Transparent (Ensures text readability) */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-navy-900 via-navy-900/95 to-navy-900/40 md:to-transparent"></div>
        
        {/* Additional bottom fade for smooth transition to white strip */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-navy-900/50 to-transparent z-10"></div>

        {/* Hero Content */}
        <div className="container mx-auto px-6 md:px-12 relative z-20 h-full flex flex-col justify-center items-start pt-10">
            
            {/* Version Badge */}
            <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 backdrop-blur-md rounded-full px-4 py-1.5 mb-8 hover:bg-white/20 transition-colors cursor-default">
                    <div className="w-2 h-2 rounded-full bg-gold-500 animate-pulse shadow-[0_0_8px_rgba(217,119,6,0.6)]"></div>
                    <span className="text-[10px] md:text-xs font-bold text-gray-200 tracking-[0.2em] uppercase font-sans">
                        Casify Platform V1.0
                    </span>
                </div>
            </div>

            {/* Main Headline - Left Aligned */}
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-6 max-w-4xl drop-shadow-2xl fade-in-up" style={{ animationDelay: '0.2s' }}>
                {t.hero.title}
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-300 max-w-xl mb-10 leading-relaxed font-light tracking-wide fade-in-up" style={{ animationDelay: '0.3s' }}>
                {t.hero.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 fade-in-up" style={{ animationDelay: '0.4s' }}>
                {/* Primary Button */}
                <button 
                    onClick={() => setView('new-case')}
                    className="group relative px-8 py-4 bg-gold-600 hover:bg-gold-500 text-white rounded-lg font-bold text-lg shadow-lg shadow-gold-900/20 transition-all hover:shadow-gold-600/30 overflow-hidden"
                >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]"></div>
                    <span className="flex items-center gap-3 relative z-10">
                        {t.hero.cta}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                </button>

                {/* Secondary Button */}
                <button 
                    onClick={() => setView('new-case')}
                    className="px-8 py-4 border-2 border-white/30 hover:border-white/80 bg-white/5 hover:bg-white/10 text-white rounded-lg font-semibold text-lg backdrop-blur-sm transition-all flex items-center justify-center gap-2"
                >
                    <PenTool className="w-5 h-5" />
                    {t.hero.secondaryCta}
                </button>
            </div>

            {/* Carousel Dots Indicators */}
            <div className="absolute bottom-10 right-6 md:right-12 flex gap-2 z-30">
                {HERO_IMAGES.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                            idx === currentImageIndex 
                            ? 'w-8 bg-gold-500' 
                            : 'w-2 bg-white/30 hover:bg-white/60'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>

        </div>
      </section>

      {/* STATUS STRIP (White bar below hero) */}
      <div className="bg-white border-b border-gray-200 relative z-30 shadow-sm">
        <div className="container mx-auto px-6 md:px-12 py-6">
            <div className="flex flex-wrap items-center justify-start gap-8 md:gap-16">
                
                {/* Item 1 */}
                <div className="flex items-center gap-3 group cursor-default">
                    <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-navy-50 transition-colors">
                        <GraduationCap className="w-4 h-4 text-gray-400 group-hover:text-navy-900 transition-colors" />
                    </div>
                    <span className="text-[10px] md:text-xs font-bold tracking-[0.15em] text-gray-400 uppercase group-hover:text-navy-900 transition-colors">
                        TSUL Standard
                    </span>
                </div>

                {/* Item 2 */}
                <div className="flex items-center gap-3 group cursor-default">
                    <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-navy-50 transition-colors">
                        <Globe2 className="w-4 h-4 text-gray-400 group-hover:text-navy-900 transition-colors" />
                    </div>
                    <span className="text-[10px] md:text-xs font-bold tracking-[0.15em] text-gray-400 uppercase group-hover:text-navy-900 transition-colors">
                        Global Access
                    </span>
                </div>

                {/* Item 3 */}
                <div className="flex items-center gap-3 group cursor-default">
                    <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-navy-50 transition-colors">
                        <ShieldCheck className="w-4 h-4 text-gray-400 group-hover:text-navy-900 transition-colors" />
                    </div>
                    <span className="text-[10px] md:text-xs font-bold tracking-[0.15em] text-gray-400 uppercase group-hover:text-navy-900 transition-colors">
                        Academic Integrity
                    </span>
                </div>

                 {/* Item 4: AI Powered */}
                 <div className="flex items-center gap-3 group cursor-default">
                    <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-navy-50 transition-colors">
                        <Cpu className="w-4 h-4 text-gray-400 group-hover:text-navy-900 transition-colors" />
                    </div>
                    <span className="text-[10px] md:text-xs font-bold tracking-[0.15em] text-gray-400 uppercase group-hover:text-navy-900 transition-colors">
                        AI Powered
                    </span>
                </div>

                 {/* Item 5: Secure Data */}
                 <div className="flex items-center gap-3 group cursor-default">
                    <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-navy-50 transition-colors">
                        <Lock className="w-4 h-4 text-gray-400 group-hover:text-navy-900 transition-colors" />
                    </div>
                    <span className="text-[10px] md:text-xs font-bold tracking-[0.15em] text-gray-400 uppercase group-hover:text-navy-900 transition-colors">
                        Secure Data
                    </span>
                </div>

                 {/* Item 6: Legal Precision */}
                 <div className="flex items-center gap-3 group cursor-default">
                    <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-navy-50 transition-colors">
                        <Scale className="w-4 h-4 text-gray-400 group-hover:text-navy-900 transition-colors" />
                    </div>
                    <span className="text-[10px] md:text-xs font-bold tracking-[0.15em] text-gray-400 uppercase group-hover:text-navy-900 transition-colors">
                        Legal Precision
                    </span>
                </div>

            </div>
        </div>
      </div>

      {/* FEATURES GRID */}
      <section className="py-24 relative overflow-hidden">
        {/* Dotted pattern background for this section */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>
        
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-10 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:border-gold-500/20 transition-all duration-300 group fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-14 h-14 bg-navy-50 rounded-xl flex items-center justify-center mb-8 group-hover:bg-navy-900 transition-colors duration-300">
                <BookOpen className="text-navy-900 w-7 h-7 group-hover:text-gold-500 transition-colors duration-300" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-navy-900 mb-4">{t.features.deepAnalysis.title}</h3>
              <p className="text-gray-600 leading-relaxed text-lg">{t.features.deepAnalysis.desc}</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-10 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:border-gold-500/20 transition-all duration-300 group fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-14 h-14 bg-navy-50 rounded-xl flex items-center justify-center mb-8 group-hover:bg-navy-900 transition-colors duration-300">
                <Globe2 className="text-navy-900 w-7 h-7 group-hover:text-gold-500 transition-colors duration-300" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-navy-900 mb-4">{t.features.bilingual.title}</h3>
              <p className="text-gray-600 leading-relaxed text-lg">{t.features.bilingual.desc}</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-10 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:border-gold-500/20 transition-all duration-300 group fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="w-14 h-14 bg-navy-50 rounded-xl flex items-center justify-center mb-8 group-hover:bg-navy-900 transition-colors duration-300">
                <ShieldCheck className="text-navy-900 w-7 h-7 group-hover:text-gold-500 transition-colors duration-300" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-navy-900 mb-4">{t.features.security.title}</h3>
              <p className="text-gray-600 leading-relaxed text-lg">{t.features.security.desc}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;