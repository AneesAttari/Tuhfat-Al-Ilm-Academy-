import { Env, hashPassword, generateId, jsonResponse } from '../_db';

const AUTHORIZED_ADMIN_EMAILS = [
  'tuhfatulilmacademy@gmail.com',
  'tuhfatalilmacademy@gmail.com',
  'tohfatulilmacademy@gmail.com',
  'aneesattari67@gmail.com'
];

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

  if (!email || !email.includes('@')) {
    return jsonResponse({ error: 'Please provide a valid administrator email.' }, 400);
  }

  if (!password || password.length < 6) {
    return jsonResponse({ error: 'Password must be at least 6 characters long.' }, 400);
  }

  const isAuthorized = AUTHORIZED_ADMIN_EMAILS.includes(email) ||
    email.endsWith('@tuhfatalilm.com') ||
    email.endsWith('@tuhfatulilm.com');

  if (!isAuthorized) {
    const existing = await env.DB.prepare('SELECT id FROM admins WHERE LOWER(email) = ?').bind(email).first();
    if (!existing) {
      return jsonResponse({
        error: `Access Denied: (${email}) is not an authorized administrator email.`
      }, 403);
    }
  }

  const salt = generateId();
  const hash = await hashPassword(password, salt);
  const now = new Date().toISOString();

  let admin = await env.DB.prepare('SELECT id, email FROM admins WHERE LOWER(email) = ?').bind(email).first<{ id: string; email: string }>();

  if (admin) {
    await env.DB.prepare('UPDATE admins SET password_hash = ?, salt = ?, updated_at = ? WHERE id = ?')
      .bind(hash, salt, now, admin.id).run();
  } else {
    const adminId = generateId();
    await env.DB.prepare(`
      INSERT INTO admins (id, email, password_hash, salt, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(adminId, email, hash, salt, now, now).run();
    admin = { id: adminId, email };
  }

  // Create session
  const sessionId = generateId();
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
    message: 'Admin password saved successfully.',
    admin: { id: admin.id, email: admin.email }
  }, 200, headers);
}
