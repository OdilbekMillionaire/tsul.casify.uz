import React, { useState, useEffect, useMemo } from 'react';
import { Translations, CaseData, LegalArea, AnalysisTone, Language } from '../types';
import { FileText, Users, Sliders, Play, AlertCircle, Info, XCircle } from 'lucide-react';
import { LEGAL_AREA_TRANSLATIONS } from '../constants';

interface CaseFormProps {
  t: Translations['form'];
  initialData: CaseData;
  onSubmit: (data: CaseData) => void;
  isLoading: boolean;
  lang: Language;
}

// Internal reusable Tooltip component
const Tooltip = ({ text }: { text: string }) => (
  <div className="group relative inline-flex ml-2 align-middle">
    <Info className="w-4 h-4 text-gray-400 hover:text-gold-500 cursor-help transition-colors" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-navy-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl z-50 pointer-events-none text-center leading-relaxed font-normal">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-navy-900"></div>
    </div>
  </div>
);

const CaseForm: React.FC<CaseFormProps> = ({ t, initialData, onSubmit, isLoading, lang }) => {
  const [data, setData] = useState<CaseData>(initialData);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sort legal areas alphabetically based on the passed language prop
  const sortedLegalAreas = useMemo(() => {
    const areas = Object.values(LegalArea).map(area => ({
        value: area,
        label: LEGAL_AREA_TRANSLATIONS[lang][area]
    }));
    
    return areas.sort((a, b) => a.label.localeCompare(b.label));
  }, [lang]);

  const validate = (formData: CaseData) => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = t.validation.required;
    if (!formData.facts.trim()) {
        newErrors.facts = t.validation.required;
    }
    return newErrors;
  };

  useEffect(() => {
    setErrors(validate(data));
  }, [data, t]);

  const updateField = (field: keyof CaseData, value: any) => {
    setData(prev => {
        const newData = { ...prev, [field]: value };
        localStorage.setItem('casify_form_state', JSON.stringify(newData));
        return newData;
    });
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const isMetadataValid = !errors.title;
  const isFactsValid = !errors.facts;

  const handleNext = () => {
    // Mark all fields in current step as touched to show errors if user tries to skip
    if (step === 1) {
        setTouched(prev => ({ ...prev, title: true }));
        if (isMetadataValid) setStep(2);
    }
    if (step === 2) {
        setTouched(prev => ({ ...prev, facts: true }));
        if (isFactsValid) setStep(3);
    }
  };

  const getInputClass = (field: string) => {
    const hasError = touched[field] && errors[field];
    return `w-full p-3 border rounded-lg outline-none transition-all ${
        hasError 
        ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200' 
        : 'border-gray-300 focus:ring-2 focus:ring-gold-500 focus:border-transparent'
    }`;
  };

  const ErrorMessage = ({ field }: { field: string }) => {
    if (!touched[field] || !errors[field]) return null;
    return (
        <div className="flex items-center gap-1 mt-1 text-red-600 text-xs font-medium animate-pulse">
            <XCircle className="w-3 h-3" />
            {errors[field]}
        </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 fade-in-up">
      {/* Stepper Header */}
      <div className="flex items-center justify-center mb-12">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-navy-900' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${step >= 1 ? 'border-navy-900 bg-navy-900 text-white' : 'border-gray-300'}`}>1</div>
            <span className="font-semibold hidden sm:block">{t.steps.metadata}</span>
        </div>
        <div className={`w-12 h-1 mx-4 ${step >= 2 ? 'bg-navy-900' : 'bg-gray-200'}`}></div>
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-navy-900' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${step >= 2 ? 'border-navy-900 bg-navy-900 text-white' : 'border-gray-300'}`}>2</div>
            <span className="font-semibold hidden sm:block">{t.steps.facts}</span>
        </div>
        <div className={`w-12 h-1 mx-4 ${step >= 3 ? 'bg-navy-900' : 'bg-gray-200'}`}></div>
        <div className={`flex items-center gap-2 ${step >= 3 ? 'text-navy-900' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${step >= 3 ? 'border-navy-900 bg-navy-900 text-white' : 'border-gray-300'}`}>3</div>
            <span className="font-semibold hidden sm:block">{t.steps.review}</span>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
        {step === 1 && (
            <div className="p-8 space-y-6 fade-in-up">
                <h2 className="font-serif text-2xl font-bold text-navy-900 border-b pb-4 mb-6">{t.steps.metadata}</h2>
                
                <div>
                    <label className="block text-sm font-bold text-navy-800 mb-2 flex items-center">
                        {t.titleLabel}
                        <Tooltip text={t.tooltips.title} />
                    </label>
                    <input 
                        type="text" 
                        value={data.title}
                        onChange={(e) => updateField('title', e.target.value)}
                        onBlur={() => handleBlur('title')}
                        className={getInputClass('title')}
                    />
                    <ErrorMessage field="title" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-navy-800 mb-2 flex items-center">
                            {t.jurisdictionLabel}
                            <Tooltip text={t.tooltips.jurisdiction} />
                        </label>
                        <select 
                            value={data.jurisdiction}
                            onChange={(e) => updateField('jurisdiction', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none bg-white"
                        >
                            <option value="Uzbekistan">Uzbekistan</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-navy-800 mb-2 flex items-center">
                            {t.areaLabel}
                            <Tooltip text={t.tooltips.area} />
                        </label>
                        <select 
                            value={data.area}
                            onChange={(e) => updateField('area', e.target.value as LegalArea)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none bg-white"
                        >
                            {sortedLegalAreas.map(item => (
                                <option key={item.value} value={item.value}>{item.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex justify-end mt-8">
                    <button 
                        onClick={handleNext} 
                        className="bg-navy-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-navy-800 transition-colors shadow-md hover:shadow-lg"
                    >
                        {t.buttons.nextFacts}
                    </button>
                </div>
            </div>
        )}

        {step === 2 && (
            <div className="p-8 space-y-6 fade-in-up">
                <h2 className="font-serif text-2xl font-bold text-navy-900 border-b pb-4 mb-6">{t.steps.facts}</h2>

                <div>
                    <label className="block text-sm font-bold text-navy-800 mb-2 flex justify-between items-center">
                        <span className="flex items-center">
                            {t.factsLabel}
                            <Tooltip text={t.tooltips.facts} />
                        </span>
                    </label>
                    <textarea 
                        value={data.facts}
                        onChange={(e) => updateField('facts', e.target.value)}
                        onBlur={() => handleBlur('facts')}
                        placeholder={t.factsPlaceholder}
                        className={`${getInputClass('facts')} h-64 resize-none font-sans leading-relaxed`}
                    ></textarea>
                     <ErrorMessage field="facts" />
                </div>

                <div className="flex justify-between mt-8">
                    <button onClick={() => setStep(1)} className="text-gray-500 font-medium hover:text-navy-900">{t.buttons.back}</button>
                    <button 
                        onClick={handleNext} 
                        className="bg-navy-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-navy-800 transition-colors shadow-md hover:shadow-lg"
                    >
                         {t.buttons.nextSettings}
                    </button>
                </div>
            </div>
        )}

        {step === 3 && (
            <div className="p-8 space-y-6 fade-in-up">
                <h2 className="font-serif text-2xl font-bold text-navy-900 border-b pb-4 mb-6">{t.steps.review}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                         <label className="block text-sm font-bold text-navy-800 mb-2 flex items-center">
                            {t.toneLabel}
                            <Tooltip text={t.tooltips.tone} />
                         </label>
                        <div className="flex gap-4">
                            {[AnalysisTone.PROFESSIONAL, AnalysisTone.STUDENT].map(tone => (
                                <button
                                    key={tone}
                                    onClick={() => updateField('tone', tone)}
                                    className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all ${data.tone === tone ? 'border-navy-900 bg-navy-50 text-navy-900' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                                >
                                    {/* Map enum value to translated string key safely */}
                                    {tone === AnalysisTone.PROFESSIONAL ? t.tones.professional : t.tones.student}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        {/* Deep Analysis Toggle */}
                        <div>
                            <label className="block text-sm font-bold text-navy-800 mb-2 flex items-center">
                                {t.depthLabel}
                                <Tooltip text={t.tooltips.depth} />
                            </label>
                            <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                                <input 
                                    type="checkbox" 
                                    id="deepAnalysis"
                                    checked={data.isDeepAnalysis}
                                    onChange={(e) => updateField('isDeepAnalysis', e.target.checked)}
                                    className="w-5 h-5 text-navy-900 rounded focus:ring-gold-500 border-gray-300"
                                />
                                <label htmlFor="deepAnalysis" className="text-sm text-gray-700 cursor-pointer select-none">
                                    {t.deepAnalysisLabel}
                                </label>
                            </div>
                        </div>

                        {/* Legal Resolution Toggle */}
                        <div>
                             <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                                <input 
                                    type="checkbox" 
                                    id="showResolution"
                                    checked={data.showLegalResolution}
                                    onChange={(e) => updateField('showLegalResolution', e.target.checked)}
                                    className="w-5 h-5 text-navy-900 rounded focus:ring-gold-500 border-gray-300"
                                />
                                <label htmlFor="showResolution" className="text-sm font-bold text-navy-900 cursor-pointer select-none">
                                    {t.resolutionLabel}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-amber-800">
                        {t.piiWarning}
                    </p>
                </div>

                <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
                    <button onClick={() => setStep(2)} className="text-gray-500 font-medium hover:text-navy-900">{t.buttons.back}</button>
                    
                    <button 
                        onClick={() => onSubmit(data)}
                        disabled={isLoading}
                        className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {t.generating}
                            </>
                        ) : (
                            <>
                                <Play className="w-5 h-5 fill-current" />
                                {t.generateBtn}
                            </>
                        )}
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default CaseForm;