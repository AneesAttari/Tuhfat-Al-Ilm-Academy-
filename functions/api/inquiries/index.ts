import { Env, verifySession, generateId, jsonResponse } from '../_db';

export async function onRequestGet(context: { request: Request; env: Env }) {
  const { request, env } = context;
  const admin = await verifySession(request, env);

  if (!admin) {
    return jsonResponse({ error: 'Unauthorized.' }, 401);
  }

  const url = new URL(request.url);
  const statusFilter = url.searchParams.get('status');

  let query = 'SELECT * FROM inquiries';
  const params: unknown[] = [];

  if (statusFilter && statusFilter !== 'all') {
    query += ' WHERE status = ?';
    params.push(statusFilter);
  }

  query += ' ORDER BY created_at DESC';

  const { results } = await env.DB.prepare(query).bind(...params).all();
  return jsonResponse({ inquiries: results || [] });
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  let body: {
    name?: string;
    email?: string;
    phone?: string;
    course?: string;
    message?: string;
  };

  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON payload' }, 400);
  }

  const name = body.name?.trim();
  const phone = body.phone?.trim();
  const email = body.email?.trim() || '';
  const course = body.course?.trim() || 'General Inquiry';
  const message = body.message?.trim() || '';

  if (!name || !phone) {
    return jsonResponse({ error: 'Name and Phone/WhatsApp are required.' }, 400);
  }

  const id = generateId();
  const now = new Date().toISOString();

  await env.DB.prepare(`
    INSERT INTO inquiries (id, name, email, phone, course, message, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, 'New', ?, ?)
  `).bind(id, name, email, phone, course, message, now, now).run();

  return jsonResponse({
    success: true,
    message: 'Inquiry saved successfully.',
    inquiryId: id
  }, 201);
}
