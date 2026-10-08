import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyDEJwYqiAB8PdeyikGZfR_gJ3ut5lXNRcM",
  authDomain: "tuhfat-al-ilm-academy.firebaseapp.com",
  projectId: "tuhfat-al-ilm-academy",
  storageBucket: "tuhfat-al-ilm-academy.firebasestorage.app",
  messagingSenderId: "729184498765",
  appId: "1:729184498765:web:a494436562f07c3cd1d804",
  measurementId: "G-VV4T0YTWEQ"
};

// Initialize Firebase App as a singleton
export const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firebase Auth Instance
export const auth = getAuth(firebaseApp);

// Google Auth Provider setup
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const AUTHORIZED_ADMIN_EMAILS = [
  'aneesattari67@gmail.com',
  'tuhfatalilmacademy@gmail.com'
];

export function isAuthorizedAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return AUTHORIZED_ADMIN_EMAILS.includes(clean);
}

export {
  signInWithPopup,
  signInWithRedirect,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
};
export type { FirebaseUser, ConfirmationResult };
