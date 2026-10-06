import { Env, verifySession, jsonResponse } from '../_db';

export async function onRequestGet(context: { request: Request; env: Env }) {
  const { request, env } = context;
  const admin = await verifySession(request, env);

  if (!admin) {
    return jsonResponse({ error: 'Unauthorized.' }, 401);
  }

  const url = new URL(request.url);
  const timeRange = url.searchParams.get('range') || 'all'; // 'today', '7d', '30d', 'all'

  let dateFilter = '';
  const now = new Date();
  if (timeRange === 'today') {
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    dateFilter = ` AND created_at >= '${startOfDay}'`;
  } else if (timeRange === '7d') {
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    dateFilter = ` AND created_at >= '${sevenDaysAgo}'`;
  } else if (timeRange === '30d') {
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    dateFilter = ` AND created_at >= '${thirtyDaysAgo}'`;
  }

  // Inquiries counts
  const totalInquiriesRow = await env.DB.prepare('SELECT COUNT(*) as count FROM inquiries').first<{ count: number }>();
  const newInquiriesRow = await env.DB.prepare("SELECT COUNT(*) as count FROM inquiries WHERE status = 'New'").first<{ count: number }>();

  // Courses counts
  const totalCoursesRow = await env.DB.prepare('SELECT COUNT(*) as count FROM courses').first<{ count: number }>();
  const publishedCoursesRow = await env.DB.prepare('SELECT COUNT(*) as count FROM courses WHERE published = 1').first<{ count: number }>();

  // Analytics event counts based on time range
  const eventCountsQuery = `
    SELECT event_type, COUNT(*) as count
    FROM analytics_events
    WHERE 1=1 ${dateFilter}
    GROUP BY event_type
  `;
  const { results: eventRows } = await env.DB.prepare(eventCountsQuery).all<{ event_type: string; count: number }>();

  const eventMap: Record<string, number> = {};
  if (eventRows) {
    for (const r of eventRows) {
      eventMap[r.event_type] = r.count;
    }
  }

  // Popular pages based on time range
  const popularPagesQuery = `
    SELECT page, COUNT(*) as views
    FROM analytics_events
    WHERE event_type = 'page_view' ${dateFilter}
    GROUP BY page
    ORDER BY views DESC
    LIMIT 8
  `;
  const { results: popularPages } = await env.DB.prepare(popularPagesQuery).all<{ page: string; views: number }>();

  return jsonResponse({
    summary: {
      totalInquiries: totalInquiriesRow?.count ?? 0,
      newInquiries: newInquiriesRow?.count ?? 0,
      totalCourses: totalCoursesRow?.count ?? 0,
      publishedCourses: publishedCoursesRow?.count ?? 0,
      pageViews: eventMap['page_view'] ?? 0,
      whatsappClicks: eventMap['whatsapp_click'] ?? 0,
      phoneClicks: eventMap['call_click'] ?? 0,
      smsClicks: eventMap['sms_click'] ?? 0,
      emailClicks: eventMap['email_click'] ?? 0,
      courseClicks: eventMap['course_click'] ?? 0,
      formSubmissions: eventMap['form_submit'] ?? 0
    },
    popularPages: popularPages || [],
    timeRange
  });
}
