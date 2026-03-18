import React, { useState } from 'react';
import { HistoryEntry, Language, ViewState, Translations } from '../types';
import { Clock, Trash2, ArrowRight, BookOpen, FileText, Search, Filter } from 'lucide-react';
import { LEGAL_AREA_TRANSLATIONS } from '../constants';

interface HistoryPageProps {
  history: HistoryEntry[];
  setHistory: (h: HistoryEntry[]) => void;
  setView: (view: ViewState) => void;
  onRestoreCase: (entry: HistoryEntry) => void;
  lang: Language;
  t: Translations['history'];
}

const HistoryPage: React.FC<HistoryPageProps> = ({ history, setHistory, setView, onRestoreCase, lang, t }) => {
  const [search, setSearch] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filtered = history.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.area.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    const next = history.filter(e => e.id !== id);
    setHistory(next);
    localStorage.setItem('casify_history', JSON.stringify(next));
    setConfirmDeleteId(null);
  };

  const handleClearAll = () => {
    setHistory([]);
    localStorage.removeItem('casify_history');
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 container mx-auto max-w-5xl fade-in-up">

      {/* Page Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-navy-900 p-2.5 rounded-xl">
            <Clock className="w-6 h-6 text-gold-500" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold text-navy-900">{t.title}</h1>
            <p className="text-gray-500 text-sm">{t.subtitle}</p>
          </div>
        </div>
      </div>

      {history.length === 0 ? (
        /* Empty State */
        <div className="text-center py-24">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-navy-900 mb-2">{t.empty.title}</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">{t.empty.desc}</p>
          <button
            onClick={() => setView('new-case')}
            className="bg-navy-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-navy-800 transition-all shadow-md flex items-center gap-2 mx-auto"
          >
            <FileText className="w-5 h-5" />
            {t.empty.btn}
          </button>
        </div>
      ) : (
        <>
          {/* Search & Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-200 focus:border-navy-300 bg-white"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-200 px-4 py-2.5 rounded-xl">
              <Filter className="w-4 h-4" />
              <span>{filtered.length} / {history.length} {t.casesLabel}</span>
            </div>
            <button
              onClick={handleClearAll}
              className="text-sm text-red-500 hover:text-red-700 border border-red-100 hover:border-red-300 hover:bg-red-50 px-4 py-2.5 rounded-xl transition-all font-medium"
            >
              {t.clearAll}
            </button>
          </div>

          {/* Case Cards */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p>No cases match your search.</p>
              </div>
            ) : (
              filtered.map(entry => {
                const areaLabel = LEGAL_AREA_TRANSLATIONS[lang]?.[entry.area] || entry.area;
                return (
                  <div
                    key={entry.id}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all group"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Left color strip */}
                      <div className="sm:w-1.5 w-full h-1.5 sm:h-auto bg-navy-900 flex-shrink-0 rounded-tl-xl rounded-bl-xl" />

                      {/* Content */}
                      <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-gray-400">{entry.date}</span>
                            <span className="bg-navy-50 text-navy-700 text-xs font-semibold px-2 py-0.5 rounded">
                              {areaLabel}
                            </span>
                            <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded">
                              {entry.caseData.jurisdiction}
                            </span>
                          </div>
                          <h3 className="font-serif font-bold text-navy-900 text-lg leading-snug truncate">
                            {entry.title}
                          </h3>
                          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                            {entry.memo.summary}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {confirmDeleteId === entry.id ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-red-600 font-medium">{t.deleteConfirm}</span>
                              <button
                                onClick={() => handleDelete(entry.id)}
                                className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors"
                              >
                                {t.yes}
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                {t.cancel}
                              </button>
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={() => setConfirmDeleteId(entry.id)}
                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onRestoreCase(entry)}
                                className="flex items-center gap-2 bg-navy-900 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-navy-800 transition-all"
                              >
                                {t.open} <ArrowRight className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default HistoryPage;
