import { AdminUser } from '../types';
import { isAuthorizedAdmin } from './firebase';

const ADMIN_CREDENTIAL_KEY = 'academy_admin_credential';
const ADMIN_SESSION_KEY = 'academy_admin_session';
export const DEFAULT_INITIAL_PASSWORD = 'anees1224';

// Helper to hash password with salt using Web Crypto API
export async function hashPasswordClient(password: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${password}:${salt}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export interface StoredAdminCredential {
  hash: string;
  salt: string;
  updatedAt: string;
}

export function getStoredAdminCredential(): StoredAdminCredential | null {
  try {
    const raw = localStorage.getItem(ADMIN_CREDENTIAL_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function setStoredAdminPassword(newPassword: string): Promise<void> {
  const cleanPass = newPassword.trim();
  const salt = (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2) + Date.now().toString(36);
  const hash = await hashPasswordClient(cleanPass, salt);
  const cred: StoredAdminCredential = {
    hash,
    salt,
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem(ADMIN_CREDENTIAL_KEY, JSON.stringify(cred));
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const clean = password.trim();
  if (!clean) return false;

  // 1. Check custom stored password if one has been set
  const stored = getStoredAdminCredential();
  if (stored && stored.hash && stored.salt) {
    const computed = await hashPasswordClient(clean, stored.salt);
    if (computed === stored.hash) {
      return true;
    }
  }

  // 2. Initial password support ('anees1224' or 'Anees1224')
  if (clean === DEFAULT_INITIAL_PASSWORD || clean.toLowerCase() === DEFAULT_INITIAL_PASSWORD.toLowerCase()) {
    return true;
  }

  return false;
}

export function saveAdminSession(admin: AdminUser): void {
  try {
    if (isAuthorizedAdmin(admin.email)) {
      localStorage.setItem(
        ADMIN_SESSION_KEY,
        JSON.stringify({
          id: admin.id,
          email: admin.email.toLowerCase().trim(),
          savedAt: Date.now()
        })
      );
    }
  } catch {}
}

export function getSavedAdminSession(): AdminUser | null {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.email && isAuthorizedAdmin(parsed.email)) {
      // Valid for 7 days
      const maxAge = 7 * 24 * 60 * 60 * 1000;
      if (parsed.savedAt && (Date.now() - parsed.savedAt) > maxAge) {
        localStorage.removeItem(ADMIN_SESSION_KEY);
        return null;
      }
      return { id: parsed.id || 'admin', email: parsed.email.toLowerCase().trim() };
    }
  } catch {}
  return null;
}

export function clearAdminSession(): void {
  try {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  } catch {}
}
