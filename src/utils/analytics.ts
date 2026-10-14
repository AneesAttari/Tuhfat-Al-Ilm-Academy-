// Privacy-conscious client-side analytics event tracker
let remoteAnalyticsDisabled = false;

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
    if (typeof window === 'undefined') return;

    // Skip tracking for automated synthetic audit bots (Lighthouse, Googlebot)
    const ua = window.navigator.userAgent || '';
    if (/lighthouse|chrome-lighthouse|googlebot|pagespeed/i.test(ua)) return;

    const page = details?.page || window.location.pathname || '/';
    const courseId = details?.course_id || details?.course || null;
    const payload = {
      event_type: eventType,
      page,
      course_id: courseId,
      session_id: getSessionId(),
      timestamp: new Date().toISOString()
    };

    // Keep lightweight client session log
    try {
      const logsRaw = sessionStorage.getItem('tuhfat_event_log');
      const logs = logsRaw ? JSON.parse(logsRaw) : [];
      logs.push(payload);
      if (logs.length > 20) logs.shift();
      sessionStorage.setItem('tuhfat_event_log', JSON.stringify(logs));
    } catch {}

    // Only dispatch network request if remote analytics hasn't previously failed with 405/404
    if (!remoteAnalyticsDisabled) {
      fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      })
        .then((res) => {
          if (res.status === 405 || res.status === 404) {
            remoteAnalyticsDisabled = true;
          }
        })
        .catch(() => {
          remoteAnalyticsDisabled = true;
        });
    }
  } catch {
    // Silent catch
  }
}

export function trackPageView(page: string) {
  trackEvent('page_view', { page });
}

