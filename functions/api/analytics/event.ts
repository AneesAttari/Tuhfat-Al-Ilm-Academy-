import { Env, generateId, jsonResponse } from '../_db';

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  let body: {
    event_type?: string;
    page?: string;
    course_id?: string;
    session_id?: string;
  };

  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid payload' }, 400);
  }

  const eventType = body.event_type?.trim();
  const page = body.page?.trim() || '/';

  if (!eventType) {
    return jsonResponse({ error: 'event_type is required' }, 400);
  }

  const id = generateId();
  const now = new Date().toISOString();

  // Non-blocking insert
  await env.DB.prepare(`
    INSERT INTO analytics_events (id, event_type, page, course_id, session_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    eventType,
    page,
    body.course_id || null,
    body.session_id || null,
    now
  ).run();

  return jsonResponse({ recorded: true });
}
