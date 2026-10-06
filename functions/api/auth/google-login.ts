import { Env, hashPassword, generateId, jsonResponse } from '../_db';

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  let body: { email?: string; credential?: string; sub?: string };
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON payload' }, 400);
  }

  let targetEmail = body.email?.trim().toLowerCase();
  const credential = body.credential;

  // Extract from JWT credential if provided
  if (credential && typeof credential === 'string' && credential.includes('.')) {
    try {
      const parts = credential.split('.');
      if (parts.length === 3) {
        const payloadStr = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
        const payload = JSON.parse(payloadStr);
        if (payload.email) {
          targetEmail = payload.email.toLowerCase().trim();
        }
      }
    } catch {}
  }

  if (!targetEmail) {
    return jsonResponse({ error: 'Google email address is required.' }, 400);
  }

  let admin = await env.DB.prepare(`
    SELECT id, email FROM admins WHERE LOWER(email) = ?
  `).bind(targetEmail).first<{ id: string; email: string }>();

  // If tuhfatalilmacademy@gmail.com and not yet created, auto-provision
  if (!admin && targetEmail === 'tuhfatalilmacademy@gmail.com') {
    const adminId = generateId();
    const salt = generateId();
    const hash = await hashPassword('Admin@Tuhfat2026!', salt);
    const now = new Date().toISOString();

    await env.DB.prepare(`
      INSERT INTO admins (id, email, password_hash, salt, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(adminId, targetEmail, hash, salt, now, now).run();

    admin = { id: adminId, email: targetEmail };
  }

  if (!admin) {
    return jsonResponse({
      error: `Access Denied: Google account (${targetEmail}) is not registered as an administrator. Only authorized academy accounts (such as tuhfatalilmacademy@gmail.com) have admin privileges.`
    }, 403);
  }

  // Create new session
  const sessionId = generateId();
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  await env.DB.prepare(`
    INSERT INTO sessions (id, admin_id, expires_at, created_at)
    VALUES (?, ?, ?, ?)
  `).bind(sessionId, admin.id, expiresAt, now).run();

  const isProduction = request.url.startsWith('https:');
  const cookieFlags = `Path=/; HttpOnly; SameSite=Lax; Max-Age=604800${isProduction ? '; Secure' : ''}`;
  const headers = {
    'Set-Cookie': `admin_session=${sessionId}; ${cookieFlags}`
  };

  return jsonResponse({
    success: true,
    admin: { id: admin.id, email: admin.email }
  }, 200, headers);
}
