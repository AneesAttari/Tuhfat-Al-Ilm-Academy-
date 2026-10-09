import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithRedirect,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  isAuthorizedAdmin,
  AUTHORIZED_ADMIN_EMAILS,
  FirebaseUser,
  updatePassword,
  EmailAuthProvider,
  linkWithCredential
} from './firebase';
import { AdminUser, User } from '../types';
import {
  saveAdminSession,
  getSavedAdminSession,
  clearAdminSession,
  verifyAdminPassword,
  setStoredAdminPassword
} from './authStorage';
import { safePostJson, safeGetJson } from './apiSafe';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  adminUser: AdminUser | null;
  currentUser: User | null;
  loading: boolean;
  isAdmin: boolean;
  authorizedEmails: string[];
  loginWithGoogle: () => Promise<{ success: boolean; admin?: AdminUser; user?: User; error?: string }>;
  loginWithEmailPassword: (email: string, pass: string) => Promise<{ success: boolean; admin?: AdminUser; error?: string }>;
  registerWithEmailPassword: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  sendPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  adminSignOut: () => Promise<void>;
  userSignOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => getSavedAdminSession());
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync Firebase authentication state with both client and backend session
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);

      if (user && user.email) {
        const cleanEmail = user.email.toLowerCase().trim();
        const userIsAdmin = isAuthorizedAdmin(cleanEmail);

        if (userIsAdmin) {
          const adminObj: AdminUser = {
            id: user.uid,
            email: cleanEmail
          };
          setAdminUser(adminObj);
          saveAdminSession(adminObj);

          // Sync session with academy backend so backend-protected routes also accept calls
          try {
            const token = await user.getIdToken();
            await safePostJson('/api/auth/google-login', {
              email: cleanEmail,
              firebaseUid: user.uid,
              idToken: token
            });
          } catch (e) {
            console.error('[Firebase Auth Sync Error]:', e);
          }
        } else {
          setAdminUser(null);
          clearAdminSession();
        }

        // Student / Normal user session sync
        setCurrentUser({
          id: user.uid,
          name: user.displayName || cleanEmail.split('@')[0],
          email: cleanEmail,
          role: userIsAdmin ? 'admin' : 'student',
          auth_provider: 'google'
        });
      } else {
        // If not logged into Firebase, check saved local admin session or backend
        const savedSession = getSavedAdminSession();
        if (savedSession) {
          setAdminUser(savedSession);
        } else {
          try {
            const data = await safeGetJson('/api/auth/session');
            if (data && data.authenticated && data.admin && isAuthorizedAdmin(data.admin.email)) {
              setAdminUser(data.admin);
              saveAdminSession(data.admin);
            } else {
              setAdminUser(null);
            }
          } catch {
            setAdminUser(null);
          }
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Real Google Sign-In using Firebase Authentication popup with redirect fallback
  const loginWithGoogle = async (): Promise<{ success: boolean; admin?: AdminUser; user?: User; error?: string }> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (!user || !user.email) {
        return { success: false, error: 'Failed to obtain user email from Google Sign-In.' };
      }

      const cleanEmail = user.email.toLowerCase().trim();
      const userIsAdmin = isAuthorizedAdmin(cleanEmail);

      const idToken = await user.getIdToken();

      // Establish backend session if backend is present
      await safePostJson('/api/auth/google-login', {
        email: cleanEmail,
        firebaseUid: user.uid,
        idToken
      });

      if (!userIsAdmin) {
        const studentUser: User = {
          id: user.uid,
          name: user.displayName || cleanEmail.split('@')[0],
          email: cleanEmail,
          role: 'student',
          auth_provider: 'google'
        };
        setCurrentUser(studentUser);
        return { success: true, user: studentUser };
      }

      const adminObj: AdminUser = { id: user.uid, email: cleanEmail };
      setAdminUser(adminObj);
      saveAdminSession(adminObj);
      return { success: true, admin: adminObj };
    } catch (err: any) {
      console.warn('[Firebase Auth Popup Warn]:', err);
      if (err.code === 'auth/popup-blocked' || err.code === 'auth/popup-closed-by-user') {
        return { success: false, error: err.message || 'Google sign-in popup was cancelled or blocked.' };
      }
      return { success: false, error: err.message || 'Firebase Google Sign-In failed.' };
    }
  };

  // Real Email/Password sign in via Firebase Auth & Verified Credentials
  const loginWithEmailPassword = async (email: string, pass: string): Promise<{ success: boolean; admin?: AdminUser; error?: string }> => {
    const cleanEmail = email.toLowerCase().trim();
    const cleanPass = pass.trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, error: 'Please enter both your email address and password.' };
    }

    // Strict authorized check
    if (!isAuthorizedAdmin(cleanEmail)) {
      return {
        success: false,
        error: `Access Denied: (${cleanEmail}) is not registered as an authorized administrator.`
      };
    }

    // 1. Attempt sign-in with Firebase Authentication
    let fbUser: any = null;
    let fbSuccess = false;
    try {
      const result = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
      fbUser = result.user;
      fbSuccess = true;
    } catch (fbErr: any) {
      console.log('[Firebase Sign-In Info]:', fbErr?.code, fbErr?.message);
    }

    if (fbSuccess && fbUser) {
      const adminObj: AdminUser = { id: fbUser.uid, email: cleanEmail };
      setAdminUser(adminObj);
      saveAdminSession(adminObj);

      // Keep stored client hash synced
      try {
        await setStoredAdminPassword(cleanPass);
      } catch {}

      // Sync backend session if available
      try {
        const idToken = await fbUser.getIdToken();
        await safePostJson('/api/auth/google-login', {
          email: cleanEmail,
          firebaseUid: fbUser.uid,
          idToken
        });
      } catch {}

      return { success: true, admin: adminObj };
    }

    // 2. Verified admin password verification (supports newly changed password and initial anees1224)
    const isPasswordValid = await verifyAdminPassword(cleanPass);
    if (isPasswordValid) {
      const adminObj: AdminUser = {
        id: auth.currentUser?.uid || `admin-${cleanEmail}`,
        email: cleanEmail
      };
      setAdminUser(adminObj);
      saveAdminSession(adminObj);

      // Attempt to link or update Firebase Auth password if current user is active
      try {
        if (auth.currentUser && auth.currentUser.email?.toLowerCase().trim() === cleanEmail) {
          const hasPasswordProvider = auth.currentUser.providerData.some(
            (p) => p.providerId === 'password'
          );
          if (hasPasswordProvider) {
            await updatePassword(auth.currentUser, cleanPass);
          } else {
            const cred = EmailAuthProvider.credential(cleanEmail, cleanPass);
            await linkWithCredential(auth.currentUser, cred);
          }
        }
      } catch (fbSyncErr: any) {
        console.log('[Firebase Password Link Note]:', fbSyncErr?.message);
      }

      // Safe backend sync
      await safePostJson('/api/auth/login', { email: cleanEmail, password: cleanPass });

      return { success: true, admin: adminObj };
    }

    return {
      success: false,
      error: 'Invalid password. Please check your credentials, or click "Forgot password?" to receive a reset link.'
    };
  };

  // Register with email & password in Firebase Auth
  const registerWithEmailPassword = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), pass);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed.' };
    }
  };

  const sendPasswordReset = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to send password reset email.' };
    }
  };

  const adminSignOut = async () => {
    clearAdminSession();
    try {
      await firebaseSignOut(auth);
    } catch {}
    try {
      await safePostJson('/api/auth/logout', {});
    } catch {}
    setAdminUser(null);
    setFirebaseUser(null);
  };

  const userSignOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch {}
    try {
      await fetch('/api/user/logout', { method: 'POST' });
    } catch {}
    setCurrentUser(null);
    setFirebaseUser(null);
  };

  const isAdmin = useMemo(() => {
    if (adminUser) return true;
    if (firebaseUser?.email && isAuthorizedAdmin(firebaseUser.email)) return true;
    return false;
  }, [adminUser, firebaseUser]);

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        adminUser,
        currentUser,
        loading,
        isAdmin,
        authorizedEmails: AUTHORIZED_ADMIN_EMAILS,
        loginWithGoogle,
        loginWithEmailPassword,
        registerWithEmailPassword,
        sendPasswordReset,
        adminSignOut,
        userSignOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
