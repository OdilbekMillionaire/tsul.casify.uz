import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAkhirz28dPm3m0JBHC0zqy_atUq7RV1N0",
  authDomain: "casify-88ad9.firebaseapp.com",
  projectId: "casify-88ad9",
  storageBucket: "casify-88ad9.firebasestorage.app",
  messagingSenderId: "173151777045",
  appId: "1:173151777045:web:2fb8569fef417a7a01f91c",
  measurementId: "G-S6S31XS9LM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = () => signInWithPopup(auth, provider);
export const signOutUser = () => signOut(auth);
export const onAuthChange = (cb: (user: User | null) => void) => onAuthStateChanged(auth, cb);

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  role: string;
  institution: string;
  specialization: string;
  createdAt: any;
  updatedAt: any;
}

export const createOrUpdateUserProfile = async (user: User, extra?: Partial<UserProfile>) => {
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      displayName: user.displayName || '',
      email: user.email || '',
      photoURL: user.photoURL || '',
      role: 'Student',
      institution: '',
      specialization: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...extra,
    });
  } else if (extra) {
    await updateDoc(ref, { ...extra, updatedAt: serverTimestamp() });
  }
  const updated = await getDoc(ref);
  return updated.data() as UserProfile;
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
  await updateDoc(doc(db, 'users', uid), { ...data, updatedAt: serverTimestamp() });
};
