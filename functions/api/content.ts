import { Env, verifySession, jsonResponse } from './_db';

export async function onRequestGet(context: { request: Request; env: Env }) {
  const { env } = context;

  // Fetch all site_settings
  const { results } = await env.DB.prepare('SELECT key, value FROM site_settings').all<{ key: string; value: string }>();
  const settings: Record<string, string> = {};
  if (results) {
    for (const row of results) {
      settings[row.key] = row.value;
    }
  }

  return jsonResponse({ settings });
}

export async function onRequestPut(context: { request: Request; env: Env }) {
  const { request, env } = context;
  const admin = await verifySession(request, env);

  if (!admin) {
    return jsonResponse({ error: 'Unauthorized.' }, 401);
  }

  let body: { settings?: Record<string, string> };
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON payload' }, 400);
  }

  if (!body.settings || typeof body.settings !== 'object') {
    return jsonResponse({ error: 'Missing settings payload' }, 400);
  }

  const now = new Date().toISOString();
  for (const [key, value] of Object.entries(body.settings)) {
    await env.DB.prepare(`
      INSERT INTO site_settings (key, value, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `).bind(key, String(value), now).run();
  }

  return jsonResponse({ success: true, message: 'Changes saved successfully.' });
}
