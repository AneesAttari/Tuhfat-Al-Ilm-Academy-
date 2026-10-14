/**
 * Cloudflare Pages Function: POST /api/analytics/event
 * Handles analytics event pings gracefully on Cloudflare Pages without 405 Method Not Allowed errors.
 */
export async function onRequestPost(context: any) {
  try {
    const body = await context.request.json().catch(() => ({}));
    return new Response(JSON.stringify({ recorded: true, status: 'ok', event: body?.event_type || 'unknown' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch {
    return new Response(JSON.stringify({ recorded: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
