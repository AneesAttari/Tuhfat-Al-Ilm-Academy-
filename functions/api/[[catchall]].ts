/**
 * Cloudflare Pages Function: Universal fallback for /api/* routes
 * Ensures any API calls on Cloudflare Pages return clean JSON without 405 or HTML fallbacks.
 */
export async function onRequest(context: any) {
  const method = context.request.method;
  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }

  return new Response(JSON.stringify({ status: 'ok', success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
