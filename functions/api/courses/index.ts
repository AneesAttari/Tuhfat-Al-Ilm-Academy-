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
    query = 'SELECT * FROM courses ORDER BY display_order ASC, created_at ASC';
  } else {
    query = 'SELECT * FROM courses WHERE published = 1 ORDER BY display_order ASC, created_at ASC';
  }

  const { results } = await env.DB.prepare(query).all();
  return jsonResponse({ courses: results || [] });
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;
  const admin = await verifySession(request, env);

  if (!admin) {
    return jsonResponse({ error: 'Unauthorized.' }, 401);
  }

  let body: {
    title?: string;
    category?: string;
    short_description?: string;
    description?: string;
    suitable_for?: string;
    icon?: string;
    display_order?: number;
    published?: number;
  };

  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON payload' }, 400);
  }

  const title = body.title?.trim();
  if (!title) {
    return jsonResponse({ error: 'Course title is required.' }, 400);
  }

  const id = generateId();
  const now = new Date().toISOString();

  await env.DB.prepare(`
    INSERT INTO courses (id, title, category, short_description, description, suitable_for, icon, display_order, published, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    title,
    body.category?.trim() || 'General',
    body.short_description?.trim() || '',
    body.description?.trim() || '',
    body.suitable_for?.trim() || 'All learners',
    body.icon?.trim() || 'BookOpen',
    Number(body.display_order ?? 0),
    body.published ? 1 : 0,
    now,
    now
  ).run();

  return jsonResponse({ success: true, message: 'Course created successfully.', courseId: id }, 201);
}
