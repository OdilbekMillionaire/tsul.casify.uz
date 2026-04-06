import { createClient } from '@supabase/supabase-js';

// ── Shared TSUL AI Supabase project (SSO hub) ─────────────────
const SUPA_URL = 'https://azafwaycrxnucncavhms.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6YWZ3YXljcnhudWNuY2F2aG1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0ODY1NjEsImV4cCI6MjA4NTA2MjU2MX0.jw08Bop4qXVQ-Iyz00jHTNjUmPl-hcT2i9qRG9X1mDg';

export const supabase = createClient(SUPA_URL, SUPA_KEY);

// ── Normalized user shape (mirrors what Firebase used to return) ─
export interface NormalizedUser {
  uid: string;
  id: string;
  displayName: string;
  email: string;
  photoURL: string;
  metadata: { creationTime?: string };
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  role: string;
  institution: string;
  specialization: string;
  // createdAt compatible with Firestore Timestamp shape
  createdAt?: { toDate: () => Date };
}

function normalizeUser(u: any): NormalizedUser {
  return {
    uid: u.id,
    id: u.id,
    displayName: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'User',
    email: u.email || '',
    photoURL: u.user_metadata?.avatar_url || u.user_metadata?.picture || '',
    metadata: { creationTime: u.created_at },
  };
}

// ── Auth functions (same names as old firebaseService.ts) ──────
export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  });
  if (error) throw error;
};

export const signOutUser = async () => {
  await supabase.auth.signOut();
};

export const onAuthChange = (cb: (user: NormalizedUser | null) => void) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    cb(session?.user ? normalizeUser(session.user) : null);
  });
  return () => subscription.unsubscribe();
};

// ── Profile helpers ────────────────────────────────────────────
export const createOrUpdateUserProfile = async (
  user: NormalizedUser,
  extra?: Partial<UserProfile>
): Promise<UserProfile> => {
  const { data: existing } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.uid)
    .single();

  if (!existing) {
    const newProfile = {
      id: user.uid,
      email: user.email,
      full_name: user.displayName,
      avatar_url: user.photoURL,
      role: extra?.role || 'Student',
      institution: extra?.institution || '',
      specialization: extra?.specialization || '',
      is_pro: false,
      plan_type: 'free',
    };
    const { data } = await supabase.from('profiles').insert([newProfile]).select().single();
    return mapProfile(data || newProfile, user.uid);
  }

  if (extra) {
    await supabase.from('profiles').update(extra).eq('id', user.uid);
    const { data: updated } = await supabase.from('profiles').select('*').eq('id', user.uid).single();
    return mapProfile(updated || existing, user.uid);
  }

  return mapProfile(existing, user.uid);
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const { data } = await supabase.from('profiles').select('*').eq('id', uid).single();
  return data ? mapProfile(data, uid) : null;
};

export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>) => {
  await supabase.from('profiles').update(updates).eq('id', uid);
};

function mapProfile(row: any, uid: string): UserProfile {
  return {
    uid,
    displayName: row.full_name || row.displayName || '',
    email: row.email || '',
    photoURL: row.avatar_url || row.photoURL || '',
    role: row.role || 'Legal Professional',
    institution: row.institution || '',
    specialization: row.specialization || '',
    createdAt: row.created_at
      ? { toDate: () => new Date(row.created_at) }
      : undefined,
  };
}
