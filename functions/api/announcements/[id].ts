import { Env, verifySession, jsonResponse } from '../_db';

export async function onRequestPut(context: { request: Request; env: Env; params: { id: string } }) {
  const { request, env, params } = context;
  const admin = await verifySession(request, env);

  if (!admin) {
    return jsonResponse({ error: 'Unauthorized.' }, 401);
  }

  let body: {
    title?: string;
    short_text?: string;
    full_text?: string;
    published?: number | boolean;
  };

  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON payload' }, 400);
  }

  const title = body.title?.trim();
  if (!title) {
    return jsonResponse({ error: 'Announcement title is required.' }, 400);
  }

  const now = new Date().toISOString();
  await env.DB.prepare(`
    UPDATE announcements
    SET title = ?, short_text = ?, full_text = ?, published = ?, updated_at = ?
    WHERE id = ?
  `).bind(
    title,
    body.short_text?.trim() || '',
    body.full_text?.trim() || '',
    body.published ? 1 : 0,
    now,
    params.id
  ).run();

  return jsonResponse({ success: true, message: 'Announcement updated.' });
}

export async function onRequestDelete(context: { request: Request; env: Env; params: { id: string } }) {
  const { request, env, params } = context;
  const admin = await verifySession(request, env);

  if (!admin) {
    return jsonResponse({ error: 'Unauthorized.' }, 401);
  }

  await env.DB.prepare('DELETE FROM announcements WHERE id = ?').bind(params.id).run();
  return jsonResponse({ success: true, message: 'Announcement deleted.' });
}
