import { Env, hashPassword, generateId, jsonResponse } from '../_db';

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  // First-time setup: ONLY allowed if 0 admins exist in the database!
  const adminCount = await env.DB.prepare('SELECT COUNT(*) as count FROM admins').first<{ count: number }>();
  if ((adminCount?.count ?? 0) > 0) {
    return jsonResponse({ error: 'Setup already completed. Please log in.' }, 403);
  }

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON payload' }, 400);
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password?.trim();

  if (!email || !email.includes('@') || !password || password.length < 8) {
    return jsonResponse({ error: 'Please provide a valid email and a strong password (minimum 8 characters).' }, 400);
  }

  const salt = generateId();
  const passwordHash = await hashPassword(password, salt);
  const now = new Date().toISOString();
  const adminId = generateId();

  await env.DB.prepare(`
    INSERT INTO admins (id, email, password_hash, salt, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(adminId, email, passwordHash, salt, now, now).run();

  // Create session
  const sessionId = generateId();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  await env.DB.prepare(`
    INSERT INTO sessions (id, admin_id, expires_at, created_at)
    VALUES (?, ?, ?, ?)
  `).bind(sessionId, adminId, expiresAt, now).run();

  const isProduction = request.url.startsWith('https:');
  const cookieFlags = `Path=/; HttpOnly; SameSite=Lax; Max-Age=604800${isProduction ? '; Secure' : ''}`;
  const headers = {
    'Set-Cookie': `admin_session=${sessionId}; ${cookieFlags}`
  };

  return jsonResponse({
    success: true,
    message: 'First administrator configured successfully.',
    admin: { id: adminId, email }
  }, 200, headers);
}
