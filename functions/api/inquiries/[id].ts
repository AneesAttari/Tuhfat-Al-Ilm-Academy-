import { Env, verifySession, jsonResponse } from '../_db';

export async function onRequestPut(context: { request: Request; env: Env; params: { id: string } }) {
  const { request, env, params } = context;
  const admin = await verifySession(request, env);

  if (!admin) {
    return jsonResponse({ error: 'Unauthorized.' }, 401);
  }

  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON payload' }, 400);
  }

  const validStatuses = ['New', 'Contacted', 'In Progress', 'Completed', 'Archived'];
  const status = body.status?.trim();

  if (!status || !validStatuses.includes(status)) {
    return jsonResponse({ error: `Status must be one of: ${validStatuses.join(', ')}` }, 400);
  }

  const now = new Date().toISOString();
  await env.DB.prepare('UPDATE inquiries SET status = ?, updated_at = ? WHERE id = ?')
    .bind(status, now, params.id)
    .run();

  return jsonResponse({ success: true, message: 'Inquiry status updated.' });
}

export async function onRequestDelete(context: { request: Request; env: Env; params: { id: string } }) {
  const { request, env, params } = context;
  const admin = await verifySession(request, env);

  if (!admin) {
    return jsonResponse({ error: 'Unauthorized.' }, 401);
  }

  await env.DB.prepare('DELETE FROM inquiries WHERE id = ?').bind(params.id).run();
  return jsonResponse({ success: true, message: 'Inquiry deleted successfully.' });
}
