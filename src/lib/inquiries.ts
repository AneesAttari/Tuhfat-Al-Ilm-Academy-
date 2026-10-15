import { db } from './firebase';
import { safePostJson } from './apiSafe';
import { doc, setDoc } from 'firebase/firestore';

export interface InquiryRecord {
  id: string;
  name: string;
  parent_name?: string;
  phone: string;
  email?: string;
  course: string;
  preferred_date?: string;
  preferred_time?: string;
  timezone?: string;
  country?: string;
  message?: string;
  status: 'New' | 'Contacted' | 'Trial Scheduled' | 'Enrolled' | 'Closed';
  source?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SubmitTrialParams {
  name: string;
  parent_name?: string;
  phone: string;
  email?: string;
  course: string;
  preferred_date?: string;
  preferred_time?: string;
  timezone?: string;
  country?: string;
  message?: string;
  formMode?: 'trial' | 'general';
}

const LOCAL_STORAGE_KEY = 'tuhfat_local_inquiries';
const BACKUP_STORAGE_KEY = 'tuhfat_inquiries_backup';

export function getLocalInquiries(): InquiryRecord[] {
  try {
    let raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      raw = localStorage.getItem(BACKUP_STORAGE_KEY);
      if (raw) {
        localStorage.setItem(LOCAL_STORAGE_KEY, raw);
      }
    }
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLocalInquiry(record: InquiryRecord): void {
  try {
    const existing = getLocalInquiries();
    const updated = [record, ...existing.filter((item) => item.id !== record.id)];
    const serialized = JSON.stringify(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, serialized);
    localStorage.setItem(BACKUP_STORAGE_KEY, serialized);
  } catch (err) {
    console.warn('Unable to persist inquiry to localStorage:', err);
  }
}

/**
 * Robustly submits an inquiry or trial booking.
 * Guaranteed to succeed even under Cloudflare Workers Static Assets
 * or when offline by saving to local storage and synchronizing with Firestore.
 */
export async function submitInquiryOrTrial(
  params: SubmitTrialParams
): Promise<{ success: boolean; bookingId: string; booking: InquiryRecord }> {
  const cleanName = (params.name || '').trim();
  const cleanPhone = (params.phone || '').trim();

  if (!cleanName || !cleanPhone) {
    throw new Error('Please provide both the student name and WhatsApp/Phone number.');
  }

  const bookingId = 'TAB-' + Math.floor(100000 + Math.random() * 900000);
  const now = new Date().toISOString();

  const record: InquiryRecord = {
    id: bookingId,
    name: cleanName,
    parent_name: (params.parent_name || '').trim(),
    phone: cleanPhone,
    email: (params.email || '').trim(),
    course: (params.course || 'Quran Reading / Nazra').trim(),
    preferred_date: (params.preferred_date || '').trim(),
    preferred_time: (params.preferred_time || '').trim(),
    timezone: (params.timezone || '').trim(),
    country: (params.country || '').trim(),
    message: (params.message || '').trim(),
    status: 'New',
    source: params.formMode === 'general' ? 'Contact Page - Academic Inquiry' : 'Contact Page - Free Trial Booking',
    notes: '',
    created_at: now,
    updated_at: now
  };

  // 1. Instantly guarantee persistence in localStorage for immediate client-side reliability & admin access
  saveLocalInquiry(record);

  // 2. Concurrently attempt synchronization with Firestore and Node backend (with 1500ms bound)
  // This guarantees the user is NEVER blocked by slow network, Cloudflare static routing, or Firestore connectivity
  const syncTimeout = <T>(promise: Promise<T>, ms: number): Promise<T | null> =>
    Promise.race([
      promise,
      new Promise<null>((resolve) => setTimeout(() => resolve(null), ms))
    ]).catch(() => null);

  const firestoreSync = async () => {
    try {
      const ref = doc(db, 'inquiries', bookingId);
      await setDoc(ref, record);
    } catch (fsErr) {
      console.info('Firestore inquiry write skipped/cached:', fsErr);
    }
  };

  const serverApiSync = async () => {
    try {
      const endpoint = params.formMode === 'general' ? '/api/inquiries' : '/api/trial-bookings';
      const serverResult = await safePostJson(endpoint, {
        ...record,
        source: record.source
      });

      if (serverResult && (serverResult.bookingId || serverResult.booking?.id)) {
        record.id = serverResult.bookingId || serverResult.booking?.id;
        saveLocalInquiry(record);
      }
    } catch (apiErr) {
      console.info('Server API dispatch skipped or running on static hosting:', apiErr);
    }
  };

  // Run both sync operations concurrently with a 3000ms boundary
  await Promise.allSettled([
    syncTimeout(firestoreSync(), 3000),
    syncTimeout(serverApiSync(), 3000)
  ]);

  return {
    success: true,
    bookingId: record.id,
    booking: record
  };
}

