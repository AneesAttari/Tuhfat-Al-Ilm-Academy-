/**
 * Cloudflare Pages Function: GET /api/analytics/summary
 */
export async function onRequestGet(context: any) {
  return new Response(JSON.stringify({
    totalPageViews: 1250,
    uniqueVisitors: 480,
    totalInquiries: 38,
    conversionRate: 3.04,
    topPages: [
      { page: '/', views: 560 },
      { page: '/courses/quran-reading', views: 240 },
      { page: '/courses/tajweed', views: 180 },
      { page: '/courses/hifz-ul-quran', views: 150 },
      { page: '/contact', views: 120 }
    ],
    viewsByDay: []
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
