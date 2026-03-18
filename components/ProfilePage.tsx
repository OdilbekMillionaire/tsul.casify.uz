import React from 'react';
import { useAuth } from '../context/AuthContext';
import { signOutUser } from '../services/firebaseService';
import { ViewState, Translations } from '../types';
import { User, Mail, LogOut, Settings, Clock, Shield, Briefcase, Star } from 'lucide-react';

interface ProfilePageProps {
  setView: (v: ViewState) => void;
  caseCount: number;
  t: Translations['profile'];
}

const ProfilePage: React.FC<ProfilePageProps> = ({ setView, caseCount, t }) => {
  const { user, profile } = useAuth();

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">{t.notSignedIn}</p>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOutUser();
    setView('landing');
  };

  const joinDate = profile.createdAt?.toDate?.()?.toLocaleDateString() || '—';

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 container mx-auto max-w-3xl fade-in-up">

      {/* Header Card */}
      <div className="bg-navy-900 rounded-2xl p-8 mb-6 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/3 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {user.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-24 h-24 rounded-full border-4 border-gold-500/50 shadow-lg flex-shrink-0" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gold-500/20 border-4 border-gold-500/50 flex items-center justify-center flex-shrink-0">
              <User className="w-12 h-12 text-gold-500" />
            </div>
          )}
          <div className="text-center sm:text-left">
            <h1 className="font-serif text-2xl font-bold">{profile.displayName || user.displayName}</h1>
            <p className="text-gray-400 flex items-center gap-1.5 justify-center sm:justify-start mt-1">
              <Mail className="w-3.5 h-3.5" /> {profile.email}
            </p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <span className="bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1 rounded-full border border-gold-500/30">
                {profile.role || 'Legal Professional'}
              </span>
              {profile.specialization && (
                <span className="bg-white/10 text-gray-300 text-xs px-3 py-1 rounded-full border border-white/10">
                  {profile.specialization}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { icon: Briefcase, label: t.casesAnalyzed, value: caseCount, color: 'text-navy-900' },
          { icon: Star, label: t.memberSince, value: joinDate, color: 'text-gold-600' },
          { icon: Shield, label: t.account, value: 'Google', color: 'text-green-600' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white rounded-xl p-4 border border-gray-200 text-center shadow-sm">
            <Icon className={`w-5 h-5 mx-auto mb-2 ${color}`} />
            <p className="font-bold text-navy-900 text-sm">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Profile Details */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-serif font-bold text-navy-900">{t.profileInfo}</h2>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: t.fields.name, value: profile.displayName || '—' },
            { label: t.fields.email, value: profile.email || '—' },
            { label: t.fields.role, value: profile.role || '—' },
            { label: t.fields.institution, value: profile.institution || '—' },
            { label: t.fields.specialization, value: profile.specialization || '—' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-500">{label}</span>
              <span className="text-sm font-medium text-navy-900">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => setView('settings' as ViewState)}
          className="flex-1 flex items-center justify-center gap-2 bg-navy-900 text-white py-3 rounded-xl font-semibold hover:bg-navy-800 transition-all shadow-md"
        >
          <Settings className="w-4 h-4" /> {t.editSettings}
        </button>
        <button
          onClick={() => setView('history')}
          className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-navy-900 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
        >
          <Clock className="w-4 h-4" /> {t.viewHistory}
        </button>
        <button
          onClick={handleSignOut}
          className="flex items-center justify-center gap-2 border border-red-100 text-red-600 py-3 px-6 rounded-xl font-semibold hover:bg-red-50 transition-all"
        >
          <LogOut className="w-4 h-4" /> {t.signOut}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
