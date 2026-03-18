import React, { useState, useEffect } from 'react';
import { Translations } from '../types';

interface GeneratingOverlayProps {
  t: Translations['generating'];
}

const GeneratingOverlay: React.FC<GeneratingOverlayProps> = ({ t }) => {
  const STAGES = t.stages;
  const [stageIdx, setStageIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIdx(i => {
        const next = i < STAGES.length - 1 ? i + 1 : i;
        return next;
      });
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const target = Math.min(((stageIdx + 1) / STAGES.length) * 92, 92);
    const t = setTimeout(() => setProgress(target), 100);
    return () => clearTimeout(t);
  }, [stageIdx]);

  const stage = STAGES[stageIdx];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-900/75 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full mx-4 text-center">

        {/* Animated scales icon */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-gold-500/10 animate-ping" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-navy-900">
              <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
              <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
              <path d="M7 21h10" /><path d="M12 3v18" />
              <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
            </svg>
          </div>
        </div>

        <h2 className="font-serif text-2xl font-bold text-navy-900 mb-1">{t.title}</h2>
        <p className="text-gray-400 text-sm mb-8">{t.subtitle}</p>

        {/* Stage indicator */}
        <div className="bg-navy-50 rounded-2xl p-5 mb-6 min-h-[80px] flex flex-col items-center justify-center transition-all">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-600" />
            </span>
            <p className="font-semibold text-navy-900 text-sm">{stage.label}</p>
          </div>
          <p className="text-xs text-gray-500">{stage.sub}</p>
        </div>

        {/* Stage dots */}
        <div className="flex justify-center gap-1.5 mb-6">
          {STAGES.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-500 ${
                i < stageIdx ? 'w-2 h-2 bg-gold-500' :
                i === stageIdx ? 'w-6 h-2 bg-navy-900' :
                'w-2 h-2 bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-navy-900 to-gold-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {t.stepOf.replace('{n}', String(stageIdx + 1)).replace('{total}', String(STAGES.length))}
        </p>
      </div>
    </div>
  );
};

export default GeneratingOverlay;
