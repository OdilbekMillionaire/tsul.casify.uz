import React, { useState, useRef } from 'react';
import { LegalMemo, CaseData, Translations, ViewState, Language, CounteranalysisResult, CaseTimeline } from '../types';
import { Printer, Copy, RefreshCw, AlertTriangle, CheckSquare, Briefcase, FileText, Check, Loader2, Link2, ExternalLink, Bot, Gavel, X, Swords, Clock, Volume2, VolumeX, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { LEGAL_AREA_TRANSLATIONS } from '../constants';
import { generateCounterarguments, generateAudioBriefing, generateTimeline } from '../services/geminiService';
import DocumentDraftModal from './DocumentDraftModal';

interface ResultViewProps {
  memo: LegalMemo;
  caseData: CaseData;
  t: Translations['result'];
  setView: (view: ViewState) => void;
  lang: Language;
}

// ── PCM → WAV converter for TTS audio playback ──────────
function playPcmAudio(base64Data: string): HTMLAudioElement {
  const binary = atob(base64Data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

  const sampleRate = 24000, channels = 1, bitsPerSample = 16;
  const dataLen = bytes.length;
  const buffer = new ArrayBuffer(44 + dataLen);
  const view = new DataView(buffer);
  const w = (off: number, str: string) => { for (let i = 0; i < str.length; i++) view.setUint8(off + i, str.charCodeAt(i)); };

  w(0, 'RIFF'); view.setUint32(4, 36 + dataLen, true);
  w(8, 'WAVE'); w(12, 'fmt ');
  view.setUint32(16, 16, true); view.setUint16(20, 1, true);
  view.setUint16(22, channels, true); view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * channels * bitsPerSample / 8, true);
  view.setUint16(32, channels * bitsPerSample / 8, true);
  view.setUint16(34, bitsPerSample, true);
  w(36, 'data'); view.setUint32(40, dataLen, true);
  new Uint8Array(buffer, 44).set(bytes);

  const url = URL.createObjectURL(new Blob([buffer], { type: 'audio/wav' }));
  const audio = new Audio(url);
  audio.play();
  return audio;
}

const ResultView: React.FC<ResultViewProps> = ({ memo, caseData, t, setView, lang }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [printStatus, setPrintStatus] = useState<'idle' | 'preparing'>('idle');
  const [isWidgetVisible, setIsWidgetVisible] = useState(true);

  // Feature 1: Counterargument Simulator
  const [counterData, setCounterData] = useState<CounteranalysisResult | null>(null);
  const [isCounterLoading, setIsCounterLoading] = useState(false);
  const [showCounter, setShowCounter] = useState(false);
  const [counterError, setCounterError] = useState<string | null>(null);

  // Feature 2: Document Draft Modal
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);

  // Feature 4: Audio Briefing (TTS)
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Feature 5: Timeline
  const [timelineData, setTimelineData] = useState<CaseTimeline | null>(null);
  const [isTimelineLoading, setIsTimelineLoading] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [timelineError, setTimelineError] = useState<string | null>(null);

  const displayArea = LEGAL_AREA_TRANSLATIONS[lang]?.[caseData.area] || caseData.area;
  const localeMap: Record<Language, string> = { 'uz_lat': 'uz-UZ', 'uz_cyr': 'uz-UZ', 'ru': 'ru-RU', 'en': 'en-US' };
  const formattedDate = new Date().toLocaleDateString(localeMap[lang]);

  const handlePrint = () => {
    setPrintStatus('preparing');
    setTimeout(() => { window.print(); setPrintStatus('idle'); }, 500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(memo, null, 2));
    setCopyStatus('copied');
    setTimeout(() => setCopyStatus('idle'), 2000);
  };

  // Feature 1: Generate counterarguments
  const handleGenerateCounter = async () => {
    if (counterData) { setShowCounter(!showCounter); return; }
    setIsCounterLoading(true);
    setCounterError(null);
    try {
      const result = await generateCounterarguments(memo, caseData, lang);
      setCounterData(result);
      setShowCounter(true);
    } catch (e: any) {
      setCounterError(e.message || 'Failed to generate counterarguments.');
    } finally {
      setIsCounterLoading(false);
    }
  };

  // Feature 4: Audio briefing
  const handleAudio = async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }
    setIsAudioLoading(true);
    setAudioError(null);
    try {
      const base64Audio = await generateAudioBriefing(memo, lang);
      const audio = playPcmAudio(base64Audio);
      audioRef.current = audio;
      setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
    } catch (e: any) {
      setAudioError('Audio briefing unavailable. ' + (e.message || ''));
    } finally {
      setIsAudioLoading(false);
    }
  };

  // Feature 5: Generate timeline
  const handleGenerateTimeline = async () => {
    if (timelineData) { setShowTimeline(!showTimeline); return; }
    setIsTimelineLoading(true);
    setTimelineError(null);
    try {
      const result = await generateTimeline(memo, caseData, lang);
      setTimelineData(result);
      setShowTimeline(true);
    } catch (e: any) {
      setTimelineError(e.message || 'Failed to generate timeline.');
    } finally {
      setIsTimelineLoading(false);
    }
  };

  const timelineTypeConfig = {
    fact:     { color: 'bg-blue-100 text-blue-800 border-blue-200',     dot: 'bg-blue-500',   label: 'Fact' },
    deadline: { color: 'bg-amber-100 text-amber-800 border-amber-200',  dot: 'bg-amber-500',  label: 'Deadline' },
    missed:   { color: 'bg-red-100 text-red-800 border-red-200',        dot: 'bg-red-500',    label: 'Missed' },
    upcoming: { color: 'bg-green-100 text-green-800 border-green-200',  dot: 'bg-green-500',  label: 'Upcoming' },
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen pt-20 pb-12 px-4 gap-8 container mx-auto fade-in-up relative">

      {/* Sidebar */}
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

          {/* Standard Actions */}
          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col gap-2">
            <button
              onClick={handleCopy}
              disabled={copyStatus === 'copied'}
              className={`flex items-center gap-2 transition-all text-sm font-medium p-2 rounded-lg border ${
                copyStatus === 'copied' ? 'bg-green-50 text-green-700 border-green-200' : 'text-gray-600 hover:text-navy-900 border-transparent hover:bg-gray-50'
              }`}
            >
              {copyStatus === 'copied' ? <><Check className="w-4 h-4" />{t.copySuccess}</> : <><Copy className="w-4 h-4" />{t.copyBtn}</>}
            </button>

            <button
              onClick={handlePrint}
              disabled={printStatus === 'preparing'}
              className="flex items-center gap-2 text-gray-600 hover:text-navy-900 transition-colors text-sm font-medium p-2 rounded-lg hover:bg-gray-50"
            >
              {printStatus === 'preparing' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
              {printStatus === 'preparing' ? t.printPreparing : t.printBtn}
            </button>

            <button onClick={() => setView('new-case')} className="flex items-center gap-2 text-gold-600 hover:text-gold-700 transition-colors text-sm font-bold mt-2 p-2">
              <RefreshCw className="w-4 h-4" /> {t.newCaseBtn}
            </button>
          </div>

          {/* New AI Feature Buttons */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">AI Features</p>

            {/* Counterarguments */}
            <button
              onClick={handleGenerateCounter}
              disabled={isCounterLoading}
              className="flex items-center gap-2 text-sm font-medium p-2 rounded-lg border border-transparent hover:bg-red-50 hover:border-red-100 text-red-700 transition-all disabled:opacity-50"
            >
              {isCounterLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Swords className="w-4 h-4" />}
              {counterData ? (showCounter ? 'Hide Counterarguments' : 'Show Counterarguments') : (isCounterLoading ? 'Analyzing...' : 'Simulate Counterarguments')}
            </button>

            {/* Document Drafter */}
            <button
              onClick={() => setIsDraftModalOpen(true)}
              className="flex items-center gap-2 text-sm font-medium p-2 rounded-lg border border-transparent hover:bg-blue-50 hover:border-blue-100 text-blue-700 transition-all"
            >
              <FileText className="w-4 h-4" />
              Draft Legal Document
            </button>

            {/* Audio Briefing */}
            <button
              onClick={handleAudio}
              disabled={isAudioLoading}
              className={`flex items-center gap-2 text-sm font-medium p-2 rounded-lg border border-transparent transition-all disabled:opacity-50 ${
                isPlaying ? 'bg-purple-50 border-purple-100 text-purple-700' : 'hover:bg-purple-50 hover:border-purple-100 text-purple-700'
              }`}
            >
              {isAudioLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              {isAudioLoading ? 'Generating audio...' : isPlaying ? 'Stop Briefing' : 'Listen to Briefing'}
            </button>

            {/* Timeline */}
            <button
              onClick={handleGenerateTimeline}
              disabled={isTimelineLoading}
              className="flex items-center gap-2 text-sm font-medium p-2 rounded-lg border border-transparent hover:bg-emerald-50 hover:border-emerald-100 text-emerald-700 transition-all disabled:opacity-50"
            >
              {isTimelineLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />}
              {timelineData ? (showTimeline ? 'Hide Timeline' : 'Show Timeline') : (isTimelineLoading ? 'Building timeline...' : 'Case Timeline & Deadlines')}
            </button>

            {/* Error notices */}
            {counterError && <p className="text-xs text-red-500 px-2">{counterError}</p>}
            {audioError && <p className="text-xs text-red-500 px-2">{audioError}</p>}
            {timelineError && <p className="text-xs text-red-500 px-2">{timelineError}</p>}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:w-3/4 space-y-6">
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

            {/* Legal Resolution */}
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

            {/* Sources */}
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
                        <h4 className="font-medium text-navy-900 group-hover:text-blue-700 text-sm line-clamp-2 leading-snug">{source.title}</h4>
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

        {/* ── FEATURE 5: Case Timeline ──────────────────────── */}
        {showTimeline && timelineData && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="flex items-center gap-3 font-serif text-xl font-bold text-navy-900">
                <Clock className="w-6 h-6 text-emerald-600" />
                Case Timeline & Legal Deadlines
              </h2>
              <button onClick={() => setShowTimeline(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8">
              {/* Critical Warnings */}
              {timelineData.criticalWarnings.length > 0 && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <h3 className="font-bold text-red-800 text-sm uppercase tracking-wide">Critical Time-Based Warnings</h3>
                  </div>
                  <ul className="space-y-1">
                    {timelineData.criticalWarnings.map((w, i) => (
                      <li key={i} className="text-red-700 text-sm flex gap-2">
                        <span className="text-red-400 flex-shrink-0">•</span> {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Statute of Limitations */}
              <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h3 className="font-bold text-amber-800 text-sm uppercase tracking-wide mb-1">Statute of Limitations</h3>
                <p className="text-amber-700 text-sm">{timelineData.statuteOfLimitationsNote}</p>
              </div>

              {/* Timeline Events */}
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-4">
                  {timelineData.events.map((event, idx) => {
                    const cfg = timelineTypeConfig[event.type as keyof typeof timelineTypeConfig] || timelineTypeConfig.fact;
                    return (
                      <div key={idx} className="flex gap-4 pl-2">
                        <div className="relative flex-shrink-0 flex flex-col items-center" style={{ width: 24 }}>
                          <div className={`w-3 h-3 rounded-full border-2 border-white shadow ${cfg.dot} z-10 mt-1.5`}></div>
                        </div>
                        <div className="flex-1 pb-2">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-xs font-mono font-bold text-gray-500">{event.date}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${cfg.color}`}>
                              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                            </span>
                          </div>
                          <p className="font-medium text-gray-900 text-sm">{event.event}</p>
                          <p className="text-xs text-gray-500 mt-0.5 italic">{event.legalSignificance}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── FEATURE 1: Counterargument Simulator ────────── */}
        {showCounter && counterData && (
          <div className="bg-white rounded-xl shadow-lg border border-red-100 overflow-hidden">
            <div className="px-8 py-5 bg-red-900 flex items-center justify-between">
              <h2 className="flex items-center gap-3 font-serif text-xl font-bold text-white">
                <Swords className="w-6 h-6 text-red-300" />
                Opposing Party Analysis
              </h2>
              <button onClick={() => setShowCounter(false)} className="text-red-300 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 space-y-8">

              {/* Opposing Position */}
              <section>
                <h3 className="font-bold text-red-800 uppercase text-xs tracking-wide mb-3">Opposing Party's Position</h3>
                <div className="bg-red-50 border-l-4 border-red-600 p-5 rounded-r-lg text-gray-800 leading-relaxed">
                  {counterData.opposingPosition}
                </div>
              </section>

              {/* Legal Basis */}
              <section>
                <h3 className="font-bold text-red-800 uppercase text-xs tracking-wide mb-3">Legal Basis</h3>
                <p className="text-gray-700 leading-relaxed">{counterData.legalBasis}</p>
              </section>

              {/* Counter-IRAC */}
              <section>
                <h3 className="font-bold text-red-800 uppercase text-xs tracking-wide mb-4">IRAC — Opposing Perspective</h3>
                <div className="space-y-6">
                  {counterData.iracAnalysis.map((item, idx) => (
                    <div key={idx} className="border border-red-100 rounded-lg p-5 bg-red-50/30">
                      <h4 className="font-bold text-navy-900 mb-2">Issue {idx + 1}: {item.issue}</h4>
                      <div className="space-y-2 text-gray-700 text-sm">
                        <p><strong className="text-red-600">Rule:</strong> {item.rule}</p>
                        <p><strong className="text-red-700">Application:</strong> {item.application}</p>
                        <p className="bg-white p-3 rounded border border-red-100"><strong>Conclusion:</strong> {item.conclusion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Weaknesses & Defenses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section>
                  <h3 className="font-bold text-red-800 uppercase text-xs tracking-wide mb-3">Weaknesses in Original Case</h3>
                  <ul className="space-y-2">
                    {counterData.weaknesses.map((w, i) => (
                      <li key={i} className="flex gap-2 text-gray-700 text-sm">
                        <span className="text-red-500 flex-shrink-0">▼</span> {w}
                      </li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3 className="font-bold text-red-800 uppercase text-xs tracking-wide mb-3">Available Defenses</h3>
                  <ul className="space-y-2">
                    {counterData.defenses.map((d, i) => (
                      <li key={i} className="flex gap-2 text-gray-700 text-sm">
                        <span className="text-emerald-600 flex-shrink-0">▲</span> {d}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Practice AI Widget */}
      {isWidgetVisible && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 animate-in slide-in-from-bottom-4 fade-in duration-500">
          <div className="bg-white p-4 rounded-2xl rounded-tr-sm shadow-2xl border border-gray-200 max-w-xs mb-2 relative">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-gold-500" />
              </div>
              <div>
                <h4 className="font-bold text-navy-900 text-sm">{t.practiceAi.title}</h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">"{t.practiceAi.greeting}"</p>
              </div>
              <button
                onClick={() => setIsWidgetVisible(false)}
                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md border border-gray-100 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Close widget"
              >
                <X size={14} />
              </button>
            </div>
          </div>
          <div className="w-14 h-14 bg-navy-900 rounded-full shadow-lg flex items-center justify-center border-4 border-white cursor-pointer hover:bg-navy-800 transition-colors">
            <Bot className="w-7 h-7 text-gold-500" />
          </div>
        </div>
      )}

      {/* Document Draft Modal (Feature 2) */}
      {isDraftModalOpen && (
        <DocumentDraftModal
          memo={memo}
          caseData={caseData}
          lang={lang}
          onClose={() => setIsDraftModalOpen(false)}
        />
      )}
    </div>
  );
};

// Helper icon components
const ScaleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" /><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" /><path d="M7 21h10" /><path d="M12 3v18" /><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
  </svg>
);

const GlobeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />
  </svg>
);

export default ResultView;
