// Privacy-conscious client-side analytics event tracker

// Generate a random session ID per browser session in sessionStorage
function getSessionId(): string {
  try {
    let sid = sessionStorage.getItem('tuhfat_sid');
    if (!sid) {
      sid = Math.random().toString(36).substring(2) + Date.now().toString(36);
      sessionStorage.setItem('tuhfat_sid', sid);
    }
    return sid;
  } catch {
    return 'anon';
  }
}

export function trackEvent(eventType: string, details?: { page?: string; course_id?: string; course?: string; [key: string]: any }) {
  try {
    const page = details?.page || window.location.pathname || '/';
    const courseId = details?.course_id || details?.course || null;
    const payload = {
      event_type: eventType,
      page,
      course_id: courseId,
      session_id: getSessionId()
    };

    fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(() => {
      // Non-blocking: analytics failures must never affect the user experience
    });
  } catch {
    // Silent catch
  }
}

export function trackPageView(page: string) {
  trackEvent('page_view', { page });
}
