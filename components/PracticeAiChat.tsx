import React, { useState, useRef, useEffect } from 'react';
import { LegalMemo, CaseData, Language, ChatMessage } from '../types';
import { chatAboutCase } from '../services/geminiService';
import { Bot, X, Send, Loader2, ChevronDown, RotateCcw } from 'lucide-react';

interface PracticeAiChatProps {
  memo: LegalMemo;
  caseData: CaseData;
  lang: Language;
}

const SUGGESTED_QUESTIONS = [
  "What are the strongest arguments in this case?",
  "What are the key weaknesses?",
  "Explain the IRAC analysis in simple terms",
  "What evidence is most critical here?",
  "What would you do differently as the lawyer?",
];

const PracticeAiChat: React.FC<PracticeAiChatProps> = ({ memo, caseData, lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: `I've fully analyzed **${memo.title}**. Ask me anything — arguments, weaknesses, IRAC elements, evidence strategy, or test your understanding with mock questions.`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: text.trim() };
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInput('');
    setIsLoading(true);

    try {
      // Pass history excluding the initial greeting
      const historyForApi = updatedHistory.slice(1); // skip the initial model greeting
      const response = await chatAboutCase(memo, caseData, historyForApi.slice(0, -1), text.trim(), lang);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'model', text: `Error: ${e.message || 'Could not get a response.'}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleReset = () => {
    setMessages([{
      role: 'model',
      text: `I've fully analyzed **${memo.title}**. Ask me anything — arguments, weaknesses, IRAC elements, evidence strategy, or test your understanding with mock questions.`
    }]);
  };

  // Format message text — bold **text**, newlines
  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={i}>
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
          )}
          {i < text.split('\n').length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
          <div
            className="bg-white px-4 py-3 rounded-2xl rounded-br-sm shadow-xl border border-gray-200 max-w-[220px] cursor-pointer hover:shadow-2xl transition-all"
            onClick={() => setIsOpen(true)}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-navy-900 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-gold-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-navy-900">Practice AI</p>
                <p className="text-[10px] text-gray-500">Ask about this case</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-navy-900 rounded-full shadow-lg flex items-center justify-center border-4 border-white hover:bg-navy-800 transition-colors"
          >
            <Bot className="w-7 h-7 text-gold-500" />
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200">

          {/* Header */}
          <div className="bg-navy-900 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Practice AI</p>
                <p className="text-[10px] text-gray-400 truncate max-w-[200px]">{memo.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleReset} className="text-gray-400 hover:text-white transition-colors p-1" title="Reset chat">
                <RotateCcw className="w-4 h-4" />
              </button>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors p-1">
                <ChevronDown className="w-5 h-5" />
              </button>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0" style={{ maxHeight: '380px' }}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {msg.role === 'model' && (
                  <div className="w-7 h-7 rounded-full bg-navy-900 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-gold-500" />
                  </div>
                )}
                <div className={`max-w-[85%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-navy-900 text-white rounded-tr-sm'
                    : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                }`}>
                  {formatText(msg.text)}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-navy-900 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-gold-500" />
                </div>
                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions (show only at start) */}
          {messages.length <= 1 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
              {SUGGESTED_QUESTIONS.slice(0, 3).map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="text-[10px] bg-navy-50 text-navy-700 border border-navy-100 px-2.5 py-1.5 rounded-full hover:bg-navy-100 transition-colors text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 pb-3 pt-2 border-t border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-navy-300 focus-within:ring-2 focus-within:ring-navy-100 transition-all">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about this case..."
                disabled={isLoading}
                className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="w-8 h-8 bg-navy-900 rounded-lg flex items-center justify-center text-white disabled:opacity-40 hover:bg-navy-800 transition-colors flex-shrink-0"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PracticeAiChat;
