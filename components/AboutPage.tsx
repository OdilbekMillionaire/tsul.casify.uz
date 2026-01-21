import React from 'react';
import { Translations } from '../types';
import { BookOpen, ExternalLink, Copyright } from 'lucide-react';

interface AboutPageProps {
  t: Translations['about'];
}

const AboutPage: React.FC<AboutPageProps> = ({ t }) => {
  return (
    <div className="container mx-auto px-4 py-20 fade-in-up max-w-6xl font-sans relative">
      
      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-navy-900 mb-6 tracking-tight">
          Casify - {t.tagline}
        </h1>
        <div className="h-1 w-24 bg-gold-500 mx-auto rounded-full mb-6"></div>
        <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            {t.mission.text.split('.')[0]}.
        </p>
      </div>
      
      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Mission Card */}
        <div className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
            <BookOpen className="w-7 h-7 text-orange-600" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-navy-900 mb-4">{t.mission.title}</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            {t.mission.text}
          </p>
        </div>

        {/* Tech Card */}
        <div className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
           <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
            <ExternalLink className="w-7 h-7 text-blue-600" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-navy-900 mb-4">{t.tech.title}</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            {t.tech.text}
          </p>
        </div>
      </div>

      {/* Developer Card (Bottom) */}
      <div className="bg-navy-900 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
        {/* Abstract shapes background */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="relative z-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 tracking-wide">{t.team.title}</h2>
            <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                {t.team.text}
            </p>
            
            <button className="inline-flex items-center gap-2 bg-navy-800 hover:bg-navy-700 text-gold-500 border border-navy-700 hover:border-gold-500 px-6 py-3 rounded-lg font-bold transition-all uppercase tracking-wider text-sm">
                <span>Oxforder MCHJ</span>
                <span className="opacity-50 text-white normal-case tracking-normal border-l border-white/20 pl-2 ml-1">Official Release</span>
            </button>
        </div>
      </div>
      
      {/* Simple Footer under the card */}
      <div className="text-center mt-12 text-gray-400 text-sm flex items-center justify-center gap-1">
         <Copyright className="w-3 h-3" /> 2026 Oxforder MCHJ. Academic License.
      </div>
    </div>
  );
};

export default AboutPage;