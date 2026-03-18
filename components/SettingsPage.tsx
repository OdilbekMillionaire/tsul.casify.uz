import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../services/firebaseService';
import { ViewState, Translations } from '../types';
import { Settings, User, Briefcase, Building, Save, ArrowLeft, CheckCircle } from 'lucide-react';

interface SettingsPageProps {
  setView: (v: ViewState) => void;
  t: Translations['settings'];
}

const ROLES = ['Student', 'Lawyer', 'Judge', 'Professor', 'Paralegal', 'Researcher', 'Other'];
const SPECIALIZATIONS = [
  'Civil Law', 'Criminal Law', 'Corporate Law', 'Family Law', 'Tax Law',
  'Intellectual Property', 'International Law', 'Constitutional Law', 'Labor Law', 'Other'
];

const SettingsPage: React.FC<SettingsPageProps> = ({ setView, t }) => {
  const { user, profile, refreshProfile } = useAuth();
  const [form, setForm] = useState({
    displayName: profile?.displayName || '',
    role: profile?.role || 'Student',
    institution: profile?.institution || '',
    specialization: profile?.specialization || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">{t.notSignedIn}</p>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await updateUserProfile(user.uid, form);
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e.message || 'Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 container mx-auto max-w-2xl fade-in-up">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => setView('profile' as ViewState)}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="bg-navy-900 p-2.5 rounded-xl">
            <Settings className="w-5 h-5 text-gold-500" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-navy-900">{t.title}</h1>
            <p className="text-sm text-gray-500">{t.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        {/* Account Info section */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="font-semibold text-navy-900 text-sm uppercase tracking-wide">{t.account}</h2>
        </div>
        <div className="p-6 space-y-5">

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <User className="w-4 h-4 text-gray-400" /> {t.displayName}
            </label>
            <input
              type="text"
              value={form.displayName}
              onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-200 focus:border-navy-300 transition-all"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Briefcase className="w-4 h-4 text-gray-400" /> {t.role}
            </label>
            <select
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-200 focus:border-navy-300 transition-all bg-white"
            >
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Building className="w-4 h-4 text-gray-400" /> {t.institution}
            </label>
            <input
              type="text"
              value={form.institution}
              onChange={e => setForm(f => ({ ...f, institution: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-200 focus:border-navy-300 transition-all"
              placeholder="e.g. TSUL, Tashkent University of Law"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">{t.specialization}</label>
            <select
              value={form.specialization}
              onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-200 focus:border-navy-300 transition-all bg-white"
            >
              <option value="">{t.selectSpec}</option>
              {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Save */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
          {error && <p className="text-sm text-red-500">{error}</p>}
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
              <CheckCircle className="w-4 h-4" /> {t.savedSuccess}
            </span>
          )}
          {!error && !saved && <span />}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-navy-900 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-navy-800 transition-all disabled:opacity-60 shadow-md"
          >
            {isSaving ? (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? t.saving : t.saveChanges}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
