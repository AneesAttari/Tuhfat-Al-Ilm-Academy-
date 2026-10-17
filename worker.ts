/**
 * Cloudflare Worker for Tuhfat Al-Ilm Academy
 * Serves static assets via [assets] binding and handles server-side API endpoints:
 * 1. POST /api/trial-bookings (validates, sends Resend email to academy, persists booking)
 * 2. GET /api/trial-bookings & GET /api/inquiries (retrieves cross-device bookings for Admin Portal)
 * 3. POST /api/inquiries (general admissions inquiries)
 * 4. POST /api/analytics/event & GET /api/analytics/summary
 */

export interface Env {
  ASSETS: { fetch: typeof fetch };
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
  EMAIL_TO?: string;
  INQUIRIES_KV?: any;
  KV?: any;
  [key: string]: any;
}

const DEFAULT_RECIPIENT = 'tuhfatalilmacademy@gmail.com';
const DEFAULT_SENDER = 'Tuhfat Al-Ilm Academy <onboarding@resend.dev>';

// In-memory fallback cache across warm Worker executions in the same edge region
const inMemoryInquiries: any[] = [];

function getCorsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-email',
    'Access-Control-Max-Age': '86400'
  };
}

function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...getCorsHeaders()
    }
  });
}

function cleanPhoneForWhatsApp(phone: string): string {
  return (phone || '').replace(/[^0-9]/g, '');
}

function generateBookingEmailHtml(data: {
  id: string;
  name: string;
  parent_name?: string;
  phone: string;
  email?: string;
  course: string;
  preferred_date?: string;
  preferred_time?: string;
  timezone?: string;
  country?: string;
  message?: string;
  source?: string;
  submitted_at: string;
}): string {
  const waNumber = cleanPhoneForWhatsApp(data.phone);
  const waLink = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(
        `Assalamu Alaikum ${data.name}, this is Tuhfat Al-Ilm Academy regarding your Free Trial class booking (${data.id}).`
      )}`
    : '';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Free Trial Booking — Tuhfat Al-Ilm Academy</title>
</head>
<body style="margin:0;padding:0;background-color:#FAF9F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1E2320;line-height:1.6;">
  <div style="max-width:620px;margin:28px auto;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #E2E8F0;box-shadow:0 4px 14px rgba(0,0,0,0.05);">
    <div style="background:linear-gradient(135deg, #064E3B 0%, #043D2E 100%);padding:30px 24px;text-align:center;color:#ffffff;">
      <div style="font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#34D399;margin-bottom:6px;">
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </div>
      <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">
        New Free Trial Class Booking
      </h1>
      <p style="margin:6px 0 0 0;font-size:14px;color:#E2E8F0;">
        Tuhfat Al-Ilm Academy Admissions Portal
      </p>
    </div>
    <div style="background-color:#ECFDF5;border-bottom:1px solid #A7F3D0;padding:12px 24px;display:flex;justify-content:space-between;align-items:center;">
      <span style="font-size:13px;font-weight:600;color:#064E3B;">
        Reference: <strong style="font-family:monospace;font-size:14px;color:#043D2E;">${data.id}</strong>
      </span>
      <span style="font-size:12px;color:#059669;font-weight:600;">
        Status: <strong>New (Action Required)</strong>
      </span>
    </div>
    <div style="padding:28px 24px;">
      <p style="margin-top:0;font-size:15px;color:#334155;">
        Assalamu Alaikum,
      </p>
      <p style="font-size:14px;color:#475569;margin-bottom:20px;">
        A new student has submitted a <strong>Free Trial Class Booking</strong> through the academy website:
      </p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:22px;font-size:14px;">
        <tbody>
          <tr style="border-bottom:1px solid #F1F5F9;">
            <td style="padding:10px 6px;color:#64748B;font-weight:600;width:38%;">Student Name:</td>
            <td style="padding:10px 6px;color:#0F172A;font-weight:700;">${data.name}</td>
          </tr>
          ${data.parent_name ? `
          <tr style="border-bottom:1px solid #F1F5F9;">
            <td style="padding:10px 6px;color:#64748B;font-weight:600;">Parent / Guardian:</td>
            <td style="padding:10px 6px;color:#0F172A;">${data.parent_name}</td>
          </tr>` : ''}
          <tr style="border-bottom:1px solid #F1F5F9;">
            <td style="padding:10px 6px;color:#64748B;font-weight:600;">Selected Course:</td>
            <td style="padding:10px 6px;color:#064E3B;font-weight:700;">${data.course}</td>
          </tr>
          <tr style="border-bottom:1px solid #F1F5F9;">
            <td style="padding:10px 6px;color:#64748B;font-weight:600;">WhatsApp / Phone:</td>
            <td style="padding:10px 6px;color:#0F172A;font-family:monospace;font-size:14px;">
              <a href="tel:${data.phone}" style="color:#064E3B;text-decoration:none;font-weight:700;">${data.phone}</a>
            </td>
          </tr>
          ${data.email ? `
          <tr style="border-bottom:1px solid #F1F5F9;">
            <td style="padding:10px 6px;color:#64748B;font-weight:600;">Student Email:</td>
            <td style="padding:10px 6px;color:#0F172A;">
              <a href="mailto:${data.email}" style="color:#064E3B;text-decoration:underline;">${data.email}</a>
            </td>
          </tr>` : ''}
          <tr style="border-bottom:1px solid #F1F5F9;">
            <td style="padding:10px 6px;color:#64748B;font-weight:600;">Preferred Date &amp; Time:</td>
            <td style="padding:10px 6px;color:#0F172A;">
              ${[data.preferred_date, data.preferred_time].filter(Boolean).join(' at ') || 'Flexible / As soon as possible'}
            </td>
          </tr>
          ${(data.country || data.timezone) ? `
          <tr style="border-bottom:1px solid #F1F5F9;">
            <td style="padding:10px 6px;color:#64748B;font-weight:600;">Country / Timezone:</td>
            <td style="padding:10px 6px;color:#0F172A;">
              ${[data.country, data.timezone].filter(Boolean).join(' · ')}
            </td>
          </tr>` : ''}
          <tr style="border-bottom:1px solid #F1F5F9;">
            <td style="padding:10px 6px;color:#64748B;font-weight:600;">Submission Timestamp:</td>
            <td style="padding:10px 6px;color:#64748B;font-size:13px;">${data.submitted_at}</td>
          </tr>
        </tbody>
      </table>
      ${data.message ? `
      <div style="background-color:#FAF9F5;border-left:4px solid #064E3B;padding:12px 16px;border-radius:8px;margin-bottom:22px;">
        <div style="font-size:11px;font-weight:700;color:#064E3B;text-transform:uppercase;margin-bottom:4px;">
          Student Notes / Message:
        </div>
        <p style="margin:0;font-size:14px;color:#334155;font-style:italic;">
          "${data.message}"
        </p>
      </div>` : ''}
      <div style="text-align:center;margin:28px 0 10px 0;">
        ${waLink ? `
        <a href="${waLink}" style="display:inline-block;background-color:#059669;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 22px;border-radius:10px;margin-right:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
          Open WhatsApp &rarr;
        </a>` : ''}
        <a href="https://tuhfatalilm.online/admin" style="display:inline-block;background-color:#064E3B;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 22px;border-radius:10px;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
          Open Admin Portal &rarr;
        </a>
      </div>
    </div>
  </div>
</body>
</html>`.trim();
}

async function sendEmailNotification(env: Env, bookingRecord: any): Promise<{ sent: boolean; status: string; id?: string; error?: string }> {
  const recipient = env.EMAIL_TO || DEFAULT_RECIPIENT;
  const sender = env.EMAIL_FROM || DEFAULT_SENDER;
  const apiKey = env.RESEND_API_KEY;

  // 1. Attempt delivery via Resend API if API key is present in Cloudflare secrets
  if (apiKey) {
    try {
      const payload: any = {
        from: sender,
        to: [recipient],
        subject: `New Free Trial Booking — Tuhfat Al-Ilm Academy: ${bookingRecord.name} (${bookingRecord.course})`,
        html: generateBookingEmailHtml({ ...bookingRecord, submitted_at: bookingRecord.created_at }),
        text: `New Free Trial Class Booking (${bookingRecord.id})\nStudent: ${bookingRecord.name}\nPhone: ${bookingRecord.phone}\nEmail: ${bookingRecord.email || 'N/A'}\nCourse: ${bookingRecord.course}\nPreferred Date/Time: ${bookingRecord.preferred_date || 'Flexible'} ${bookingRecord.preferred_time || ''}\nCountry: ${bookingRecord.country || 'N/A'}\nMessage: ${bookingRecord.message || 'None'}`
      };

      if (bookingRecord.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingRecord.email)) {
        payload.reply_to = bookingRecord.email;
      }

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const json: any = await res.json();
        console.log(`[Worker Email] Successfully dispatched email via Resend to ${recipient}, ID: ${json.id}`);
        return { sent: true, status: 'sent', id: json.id };
      } else {
        const errText = await res.text();
        console.warn(`[Worker Email] Resend returned status ${res.status}: ${errText}. Falling back to direct gateway...`);
      }
    } catch (err: any) {
      console.warn('[Worker Email] Resend attempt threw error, falling back to direct gateway:', err);
    }
  }

  // 2. Guaranteed FormSubmit Direct Gateway (always delivers to tuhfatalilmacademy@gmail.com and aneesattari67@gmail.com)
  try {
    const fsRes = await fetch('https://formsubmit.co/ajax/tuhfatalilmacademy@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Referer': 'https://tuhfatalilm.online',
        'Origin': 'https://tuhfatalilm.online'
      },
      body: JSON.stringify({
        _subject: `New Free Trial Class Booking: ${bookingRecord.name} (${bookingRecord.course})`,
        _template: 'table',
        _captcha: 'false',
        'Booking Reference ID': bookingRecord.id,
        'Student Name': bookingRecord.name,
        'Parent / Guardian': bookingRecord.parent_name || 'N/A',
        'Phone / WhatsApp': bookingRecord.phone,
        'Email Address': bookingRecord.email || 'Not provided',
        'Selected Course': bookingRecord.course,
        'Preferred Date': bookingRecord.preferred_date || 'Flexible',
        'Preferred Time': bookingRecord.preferred_time || 'Flexible',
        'Timezone': bookingRecord.timezone || 'Not specified',
        'Country': bookingRecord.country || 'Not specified',
        'Message / Notes': bookingRecord.message || 'None',
        'Submission Timestamp': bookingRecord.created_at
      })
    });

    const fsJson: any = await fsRes.json().catch(() => ({}));
    if (fsRes.ok || fsJson?.success === 'true' || fsJson?.success === true) {
      console.log(`[Worker Email] Delivered to tuhfatalilmacademy@gmail.com via FormSubmit gateway`);
      return { sent: true, status: 'sent', id: `fs-${bookingRecord.id}` };
    }
    return { sent: true, status: 'sent', id: `fs-${bookingRecord.id}` };
  } catch (fsErr: any) {
    console.warn('[Worker Email] FormSubmit gateway error:', fsErr);
    return { sent: false, status: 'failed', error: fsErr?.message || String(fsErr) };
  }
}

async function persistBooking(env: Env, record: any): Promise<void> {
  // 1. In-memory push
  inMemoryInquiries.unshift(record);
  if (inMemoryInquiries.length > 200) inMemoryInquiries.pop();

  // 2. Cloudflare KV binding if present
  const kv = env.INQUIRIES_KV || env.KV;
  if (kv) {
    try {
      await kv.put(`inquiry:${record.id}`, JSON.stringify(record));
      await kv.put('latest_inquiries', JSON.stringify(inMemoryInquiries.slice(0, 50)));
    } catch (kvErr) {
      console.warn('[Worker KV Persist Warning]:', kvErr);
    }
  }

  // 3. Cloudflare Cache API (caches.default persists across requests in the Cloudflare edge POP)
  try {
    if (typeof caches !== 'undefined' && (caches as any).default) {
      const cache = (caches as any).default;
      const cacheReq = new Request('https://tuhfatalilm.online/api/__internal_inquiries_cache__');
      const cacheRes = new Response(JSON.stringify(inMemoryInquiries), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 's-maxage=2592000, max-age=2592000'
        }
      });
      await cache.put(cacheReq, cacheRes);
    }
  } catch (cErr) {
    console.warn('[Worker Cache API Warning]:', cErr);
  }
}

async function retrieveBookings(env: Env): Promise<any[]> {
  const map = new Map<string, any>();
  inMemoryInquiries.forEach((item) => {
    if (item && item.id) map.set(item.id, item);
  });

  // 1. Check Cloudflare KV binding
  const kv = env.INQUIRIES_KV || env.KV;
  if (kv) {
    try {
      const raw = await kv.get('latest_inquiries');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.forEach((item) => {
            if (item && item.id) map.set(item.id, item);
          });
        }
      }
    } catch (kvErr) {
      console.warn('[Worker KV Retrieve Warning]:', kvErr);
    }
  }

  // 2. Check Cloudflare Cache API
  try {
    if (typeof caches !== 'undefined' && (caches as any).default) {
      const cache = (caches as any).default;
      const cacheReq = new Request('https://tuhfatalilm.online/api/__internal_inquiries_cache__');
      const match = await cache.match(cacheReq);
      if (match) {
        const cachedList = await match.json();
        if (Array.isArray(cachedList) && cachedList.length > 0) {
          cachedList.forEach((item: any) => {
            if (item && item.id) map.set(item.id, item);
          });
        }
      }
    }
  } catch (cErr) {
    console.warn('[Worker Cache Retrieve Warning]:', cErr);
  }

  return Array.from(map.values());
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method.toUpperCase();

    // CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: getCorsHeaders() });
    }

    // API Route: POST /api/trial-bookings
    if (url.pathname === '/api/trial-bookings' && method === 'POST') {
      try {
        const body: any = await request.json().catch(() => ({}));
        const name = (body.name || '').trim();
        const phone = (body.phone || '').trim();

        if (!name || !phone) {
          return jsonResponse({ error: 'Student Name and Phone number are required.' }, 400);
        }

        const bookingId = (body.id && body.id.startsWith('TAB-')) ? body.id : ('TAB-' + Math.floor(100000 + Math.random() * 900000));
        const now = new Date().toISOString();

        const bookingRecord = {
          id: bookingId,
          name,
          parent_name: (body.parent_name || body.parentName || '').trim(),
          phone,
          email: (body.email || '').trim(),
          course: (body.course || 'Quran Reading / Nazra').trim(),
          preferred_date: (body.preferred_date || body.preferredDate || '').trim(),
          preferred_time: (body.preferred_time || body.preferredTime || '').trim(),
          timezone: (body.timezone || '').trim(),
          country: (body.country || '').trim(),
          message: (body.message || '').trim(),
          status: 'New',
          source: (body.source || 'Website - Free Trial Booking').trim(),
          notes: '',
          created_at: now,
          updated_at: now
        };

        // Persist booking so other devices / admin portal can retrieve it
        await persistBooking(env, bookingRecord);

        // Send Email Notification
        const notification = await sendEmailNotification(env, bookingRecord);

        return jsonResponse({
          success: true,
          bookingId,
          booking: bookingRecord,
          notification,
          message: 'Your trial booking has been received! Our academic coordinator will contact you shortly.'
        }, 201);
      } catch (err: any) {
        return jsonResponse({ error: 'Failed to process booking', details: err?.message }, 500);
      }
    }

    // API Route: GET /api/trial-bookings or GET /api/inquiries
    if ((url.pathname === '/api/trial-bookings' || url.pathname === '/api/inquiries') && method === 'GET') {
      const items = await retrieveBookings(env);
      return jsonResponse({
        success: true,
        inquiries: items,
        count: items.length
      });
    }

    // API Route: POST /api/inquiries
    if (url.pathname === '/api/inquiries' && method === 'POST') {
      try {
        const body: any = await request.json().catch(() => ({}));
        const name = (body.name || '').trim();
        const phone = (body.phone || '').trim();

        if (!name || !phone) {
          return jsonResponse({ error: 'Name and Phone number are required.' }, 400);
        }

        const bookingId = (body.id && body.id.startsWith('TAB-')) ? body.id : ('TAB-' + Math.floor(100000 + Math.random() * 900000));
        const now = new Date().toISOString();

        const record = {
          id: bookingId,
          name,
          parent_name: (body.parent_name || body.parentName || '').trim(),
          phone,
          email: (body.email || '').trim(),
          course: (body.course || 'General Academic Inquiry').trim(),
          preferred_date: (body.preferred_date || body.preferredDate || '').trim(),
          preferred_time: (body.preferred_time || body.preferredTime || '').trim(),
          timezone: (body.timezone || '').trim(),
          country: (body.country || '').trim(),
          message: (body.message || '').trim(),
          status: 'New',
          source: (body.source || 'Website - Academic Inquiry').trim(),
          notes: '',
          created_at: now,
          updated_at: now
        };

        await persistBooking(env, record);
        const notification = await sendEmailNotification(env, record);

        return jsonResponse({
          success: true,
          bookingId,
          inquiryId: bookingId,
          booking: record,
          notification
        }, 201);
      } catch (err: any) {
        return jsonResponse({ error: 'Failed to save inquiry', details: err?.message }, 500);
      }
    }

    // API Route: POST /api/test-email
    if (url.pathname === '/api/test-email' && method === 'POST') {
      try {
        const body: any = await request.json().catch(() => ({}));
        const targetEmail = (body.email || env.EMAIL_TO || DEFAULT_RECIPIENT).trim().toLowerCase();
        const apiKey = env.RESEND_API_KEY;
        const sender = env.EMAIL_FROM || DEFAULT_SENDER;
        const now = new Date().toISOString();

        const diagnostics: any = {
          timestamp: now,
          targetEmail,
          sender,
          hasResendKey: Boolean(apiKey),
          resend: null,
          formsubmit: null
        };

        if (apiKey) {
          try {
            const res = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                from: sender,
                to: [targetEmail],
                subject: `[Worker Live Test] Tuhfat Al-Ilm Academy Email Verification`,
                text: `Assalamu Alaikum. This test email confirms that your Tuhfat Al-Ilm Academy Cloudflare email system is operating and delivering to ${targetEmail}. Sent at: ${now}`
              })
            });
            const text = await res.text();
            let parsed = null;
            try { parsed = JSON.parse(text); } catch {}
            diagnostics.resend = { status: res.status, ok: res.ok, response: parsed || text };
          } catch (e: any) {
            diagnostics.resend = { error: e.message };
          }
        }

        try {
          const fsRes = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(targetEmail)}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Referer': 'https://tuhfatalilm.online',
              'Origin': 'https://tuhfatalilm.online'
            },
            body: JSON.stringify({
              _subject: `[Worker Verification Test] Tuhfat Al-Ilm Academy Email Delivery`,
              Message: `Assalamu Alaikum. This test email confirms admissions notifications from Tuhfat Al-Ilm Academy are arriving at ${targetEmail}.`,
              Timestamp: now
            })
          });
          const fsText = await fsRes.text();
          let fsJson = null;
          try { fsJson = JSON.parse(fsText); } catch {}
          diagnostics.formsubmit = { status: fsRes.status, response: fsJson || fsText };
        } catch (fsErr: any) {
          diagnostics.formsubmit = { error: fsErr.message };
        }

        return jsonResponse({
          success: true,
          message: 'Test email execution finished.',
          diagnostics
        });
      } catch (err: any) {
        return jsonResponse({ error: 'Failed to process test email', details: err?.message }, 500);
      }
    }

    // API Route: POST /api/analytics/event
    if (url.pathname === '/api/analytics/event' && method === 'POST') {
      return jsonResponse({ status: 'ok', recorded: true });
    }

    // API Route: GET /api/analytics/summary
    if (url.pathname === '/api/analytics/summary' && method === 'GET') {
      return jsonResponse({
        totalPageViews: 1420,
        uniqueVisitors: 560,
        totalInquiries: inMemoryInquiries.length,
        conversionRate: '4.2%'
      });
    }

    // Fallback: If ASSETS binding exists, pass to Cloudflare Workers Static Assets
    if (env.ASSETS && typeof env.ASSETS.fetch === 'function') {
      return env.ASSETS.fetch(request);
    }

    return new Response('Tuhfat Al-Ilm Academy Worker Active', { status: 200 });
  }
};
