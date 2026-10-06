import { Env, hashPassword, generateId, jsonResponse } from '../_db';

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON payload' }, 400);
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password?.trim();

  if (!email || !password) {
    return jsonResponse({ error: 'Please enter both email and password.' }, 400);
  }

  const admin = await env.DB.prepare(`
    SELECT id, email, password_hash, salt FROM admins WHERE LOWER(email) = ?
  `).bind(email).first<{ id: string; email: string; password_hash: string; salt: string }>();

  if (!admin) {
    return jsonResponse({ error: 'Invalid credentials.' }, 401);
  }

  const computedHash = await hashPassword(password, admin.salt);
  if (computedHash !== admin.password_hash) {
    return jsonResponse({ error: 'Invalid credentials.' }, 401);
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
