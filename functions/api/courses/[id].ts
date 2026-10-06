import { Env, verifySession, jsonResponse } from '../_db';

export async function onRequestGet(context: { request: Request; env: Env; params: { id: string } }) {
  const { env, params } = context;
  const courseId = params.id.toLowerCase();

  const course = await env.DB.prepare(
    'SELECT * FROM courses WHERE id = ? OR LOWER(title) LIKE ?'
  ).bind(courseId, `%${courseId}%`).first();

  if (!course) {
    return jsonResponse({ error: 'Course not found' }, 404);
  }

  return jsonResponse({ course });
}

export async function onRequestPut(context: { request: Request; env: Env; params: { id: string } }) {
  const { request, env, params } = context;
  const admin = await verifySession(request, env);

  if (!admin) {
    return jsonResponse({ error: 'Unauthorized.' }, 401);
  }

  const courseId = params.id;
  let body: {
    title?: string;
    category?: string;
    short_description?: string;
    description?: string;
    suitable_for?: string;
    icon?: string;
    display_order?: number;
    published?: number | boolean;
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

  const now = new Date().toISOString();

  await env.DB.prepare(`
    UPDATE courses
    SET title = ?, category = ?, short_description = ?, description = ?, suitable_for = ?, icon = ?, display_order = ?, published = ?, updated_at = ?
    WHERE id = ?
  `).bind(
    title,
    body.category?.trim() || 'General',
    body.short_description?.trim() || '',
    body.description?.trim() || '',
    body.suitable_for?.trim() || 'All learners',
    body.icon?.trim() || 'BookOpen',
    Number(body.display_order ?? 0),
    body.published ? 1 : 0,
    now,
    courseId
  ).run();

  return jsonResponse({ success: true, message: 'Course updated successfully.' });
}

export async function onRequestDelete(context: { request: Request; env: Env; params: { id: string } }) {
  const { request, env, params } = context;
  const admin = await verifySession(request, env);

  if (!admin) {
    return jsonResponse({ error: 'Unauthorized.' }, 401);
  }

  await env.DB.prepare('DELETE FROM courses WHERE id = ?').bind(params.id).run();
  return jsonResponse({ success: true, message: 'Course deleted successfully.' });
}
