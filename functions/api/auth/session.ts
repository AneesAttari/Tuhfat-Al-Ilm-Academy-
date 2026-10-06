import { Env, verifySession, jsonResponse } from '../_db';

export async function onRequestGet(context: { request: Request; env: Env }) {
  const { request, env } = context;

  // Check if any admin exists in the database
  const adminCount = await env.DB.prepare('SELECT COUNT(*) as count FROM admins').first<{ count: number }>();
  const setupRequired = (adminCount?.count ?? 0) === 0;

  const admin = await verifySession(request, env);

  if (!admin) {
    return jsonResponse({
      authenticated: false,
      setupRequired
    });
  }

  return jsonResponse({
    authenticated: true,
    setupRequired: false,
    admin: {
      id: admin.id,
      email: admin.email
    }
  });
}
