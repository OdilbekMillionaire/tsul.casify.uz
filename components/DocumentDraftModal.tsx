import React, { useState } from 'react';
import { DocumentType, LegalMemo, CaseData, Language } from '../types';
import { draftLegalDocument } from '../services/geminiService';
import { X, FileText, Copy, Check, Loader2, Printer } from 'lucide-react';

interface DocumentDraftModalProps {
  memo: LegalMemo;
  caseData: CaseData;
  lang: Language;
  onClose: () => void;
}

const DocumentDraftModal: React.FC<DocumentDraftModalProps> = ({ memo, caseData, lang, onClose }) => {
  const [selectedType, setSelectedType] = useState<DocumentType>(DocumentType.COMPLAINT);
  const [draftedText, setDraftedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const text = await draftLegalDocument(memo, caseData, selectedType, lang);
      setDraftedText(text);
    } catch (e: any) {
      setError(e.message || 'Failed to generate document. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(draftedText);
    setCopyStatus('copied');
    setTimeout(() => setCopyStatus('idle'), 2000);
  };

  const handlePrint = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>${selectedType} — ${memo.title}</title>
          <style>
            body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; margin: 2cm; color: #000; }
            pre { white-space: pre-wrap; font-family: inherit; }
          </style>
        </head>
        <body><pre>${draftedText}</pre></body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-navy-900 p-2 rounded-lg">
              <FileText className="w-5 h-5 text-gold-500" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-navy-900">Legal Document Drafter</h2>
              <p className="text-xs text-gray-500">Generate a court-ready document from this analysis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Document Type Selector */}
          {!draftedText && (
            <>
              <div>
                <label className="block text-sm font-bold text-navy-800 mb-3 uppercase tracking-wide">
                  Select Document Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.values(DocumentType).map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`p-4 rounded-xl border-2 text-sm font-medium text-left transition-all ${
                        selectedType === type
                          ? 'border-navy-900 bg-navy-50 text-navy-900 shadow-sm'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="block font-bold text-sm">{type}</span>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full bg-navy-900 text-white py-3.5 rounded-xl font-bold hover:bg-navy-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Drafting {selectedType}...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    Generate {selectedType}
                  </>
                )}
              </button>
            </>
          )}

          {/* Drafted Document */}
          {draftedText && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-navy-900">{selectedType}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Replace all <span className="font-mono bg-gray-100 px-1 rounded">[BRACKETS]</span> with actual information before filing
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                      copyStatus === 'copied'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {copyStatus === 'copied' ? <><Check className="w-4 h-4" />Copied!</> : <><Copy className="w-4 h-4" />Copy</>}
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    <Printer className="w-4 h-4" /> Print
                  </button>
                  <button
                    onClick={() => setDraftedText('')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    Change Type
                  </button>
                </div>
              </div>

              <textarea
                value={draftedText}
                onChange={(e) => setDraftedText(e.target.value)}
                className="w-full h-[420px] p-5 border border-gray-200 rounded-xl font-mono text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-navy-300 resize-none leading-relaxed bg-gray-50"
                spellCheck={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentDraftModal;
