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
  FirebaseUser
} from './firebase';
import { AdminUser, User } from '../types';

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
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
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

          // Sync session with academy backend so backend-protected routes also accept calls
          try {
            const token = await user.getIdToken();
            await fetch('/api/auth/google-login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: cleanEmail,
                firebaseUid: user.uid,
                idToken: token
              })
            });
          } catch (e) {
            console.error('[Firebase Auth Sync Error]:', e);
          }
        } else {
          setAdminUser(null);
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
        // If not logged into Firebase, check if legacy backend session exists
        try {
          const res = await fetch('/api/auth/session');
          const data = await res.json();
          if (data.authenticated && data.admin && isAuthorizedAdmin(data.admin.email)) {
            setAdminUser(data.admin);
          } else {
            setAdminUser(null);
          }
        } catch {
          setAdminUser(null);
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

      // Establish backend session
      const backendRes = await fetch('/api/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          firebaseUid: user.uid,
          idToken
        })
      });

      const backendData = await backendRes.json();

      if (!backendRes.ok && userIsAdmin === false) {
        return {
          success: false,
          error: `Access Denied: Google account (${cleanEmail}) is not an authorized administrator.`
        };
      }

      if (userIsAdmin) {
        const adminObj: AdminUser = { id: user.uid, email: cleanEmail };
        setAdminUser(adminObj);
        return { success: true, admin: adminObj };
      } else {
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
    } catch (err: any) {
      console.warn('[Firebase Auth Popup Warn]:', err);
      // Popup blocked or mobile browser constraint: attempt redirect fallback if desired
      if (err.code === 'auth/popup-blocked' || err.code === 'auth/popup-closed-by-user') {
        return { success: false, error: err.message || 'Google sign-in popup was cancelled or blocked.' };
      }
      return { success: false, error: err.message || 'Firebase Google Sign-In failed.' };
    }
  };

  // Real Email/Password sign in via Firebase Auth
  const loginWithEmailPassword = async (email: string, pass: string): Promise<{ success: boolean; admin?: AdminUser; error?: string }> => {
    const cleanEmail = email.toLowerCase().trim();
    try {
      const result = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      const user = result.user;
      const userIsAdmin = isAuthorizedAdmin(cleanEmail);

      if (userIsAdmin) {
        const adminObj: AdminUser = { id: user.uid, email: cleanEmail };
        setAdminUser(adminObj);

        // Also sync backend session
        try {
          const idToken = await user.getIdToken();
          await fetch('/api/auth/google-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: cleanEmail,
              firebaseUid: user.uid,
              idToken
            })
          });
        } catch {}

        return { success: true, admin: adminObj };
      } else {
        return {
          success: false,
          error: `Account (${cleanEmail}) is not authorized for administrative access.`
        };
      }
    } catch (err: any) {
      // If user not in Firebase Auth yet, fallback to backend password verification
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password: pass })
        });
        const data = await res.json();
        if (res.ok && data.admin) {
          setAdminUser(data.admin);
          // Automatically try to create/link user in Firebase Auth if not exists
          try {
            await createUserWithEmailAndPassword(auth, cleanEmail, pass);
          } catch {}
          return { success: true, admin: data.admin };
        }
        return { success: false, error: data.error || err.message || 'Invalid credentials.' };
      } catch {
        return { success: false, error: err.message || 'Failed to sign in.' };
      }
    }
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
    try {
      await firebaseSignOut(auth);
    } catch {}
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
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
