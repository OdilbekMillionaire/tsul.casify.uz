import React from 'react';
import { Translations } from '../types';
import { BookOpen, ExternalLink, Copyright, FileText, GraduationCap, Layers } from 'lucide-react';

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

      {/* Developer Card (Redesigned) */}
      <div className="bg-navy-900 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden border border-navy-800">
        
        {/* Background Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center">
            {/* Badge */}
            <div className="inline-block border border-gold-600/30 bg-gold-500/10 rounded-full px-5 py-1.5 mb-8">
                <span className="text-gold-500 text-xs font-bold tracking-[0.2em] uppercase">
                     • ISHLAB CHIQARUVCHI
                </span>
            </div>

            {/* Title */}
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-white">
                Created by <span className="text-gold-500">Oxforder MCHJ</span>
            </h2>

            {/* Subtitle */}
            <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto mb-12 font-light">
                Ushbu platforma O'zbekistondagi eng zo'r EdTech kompaniyasi — Oxforder MCHJ tomonidan yaratilgan bo'lib, ta'limdagi innovatsiyalar yetakchisi hisoblanadi.
            </p>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
                {/* Card 1 */}
                <div className="bg-navy-800/40 backdrop-blur-sm border border-navy-700/50 p-6 rounded-2xl hover:bg-navy-800/60 transition-colors group">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <FileText className="w-5 h-5 text-orange-500" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">Best EdTech Company</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Recognized for innovation in legal education</p>
                </div>

                {/* Card 2 */}
                <div className="bg-navy-800/40 backdrop-blur-sm border border-navy-700/50 p-6 rounded-2xl hover:bg-navy-800/60 transition-colors group">
                     <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <GraduationCap className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">Academic Excellence</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Setting the standard for AI assessment</p>
                </div>

                {/* Card 3 */}
                <div className="bg-navy-800/40 backdrop-blur-sm border border-navy-700/50 p-6 rounded-2xl hover:bg-navy-800/60 transition-colors group">
                     <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Layers className="w-5 h-5 text-pink-500" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">Future Ready</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Pioneering the next generation of tools</p>
                </div>
            </div>
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