import { Env, verifySession, generateId, jsonResponse } from '../_db';

export async function onRequestGet(context: { request: Request; env: Env }) {
  const { request, env } = context;
  const url = new URL(request.url);
  const showAll = url.searchParams.get('all') === 'true';

  let admin = null;
  if (showAll) {
    admin = await verifySession(request, env);
  }

  let query: string;
  if (admin && showAll) {
    query = 'SELECT * FROM announcements ORDER BY created_at DESC';
  } else {
    query = 'SELECT * FROM announcements WHERE published = 1 ORDER BY created_at DESC';
  }

  const { results } = await env.DB.prepare(query).all();
  return jsonResponse({ announcements: results || [] });
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;
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

  const id = generateId();
  const now = new Date().toISOString();

  await env.DB.prepare(`
    INSERT INTO announcements (id, title, short_text, full_text, published, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    title,
    body.short_text?.trim() || '',
    body.full_text?.trim() || '',
    body.published ? 1 : 0,
    now,
    now
  ).run();

  return jsonResponse({ success: true, message: 'Announcement created.', announcementId: id }, 201);
}
