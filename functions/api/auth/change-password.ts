import { Env, verifySession, hashPassword, generateId, jsonResponse } from '../_db';

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;
  const admin = await verifySession(request, env);

  if (!admin) {
    return jsonResponse({ error: 'Unauthorized.' }, 401);
  }

  let body: { currentPassword?: string; newPassword?: string };
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON payload' }, 400);
  }

  const { currentPassword, newPassword } = body;
  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return jsonResponse({ error: 'New password must be at least 8 characters long.' }, 400);
  }

  const adminRecord = await env.DB.prepare(`
    SELECT password_hash, salt FROM admins WHERE id = ?
  `).bind(admin.id).first<{ password_hash: string; salt: string }>();

  if (!adminRecord) {
    return jsonResponse({ error: 'Admin record not found.' }, 404);
  }

  const currentHash = await hashPassword(currentPassword, adminRecord.salt);
  if (currentHash !== adminRecord.password_hash) {
    return jsonResponse({ error: 'Current password is incorrect.' }, 400);
  }

  const newSalt = generateId();
  const newHash = await hashPassword(newPassword, newSalt);
  const now = new Date().toISOString();

  await env.DB.prepare(`
    UPDATE admins SET password_hash = ?, salt = ?, updated_at = ? WHERE id = ?
  `).bind(newHash, newSalt, now, admin.id).run();

  return jsonResponse({ success: true, message: 'Password updated successfully.' });
}
