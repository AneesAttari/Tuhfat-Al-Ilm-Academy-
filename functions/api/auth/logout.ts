import { Env, parseCookies, jsonResponse } from '../_db';

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;
  const cookies = parseCookies(request.headers.get('Cookie'));
  const sessionToken = cookies['admin_session'];

  if (sessionToken) {
    await env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionToken).run();
  }

  const isProduction = request.url.startsWith('https:');
  const cookieFlags = `Path=/; HttpOnly; SameSite=Lax; Max-Age=0${isProduction ? '; Secure' : ''}`;

  return jsonResponse({ success: true, message: 'Logged out successfully.' }, 200, {
    'Set-Cookie': `admin_session=; ${cookieFlags}`
  });
}
