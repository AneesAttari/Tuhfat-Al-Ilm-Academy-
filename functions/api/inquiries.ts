/**
 * Cloudflare Pages Function: /api/inquiries
 * Handles:
 * 1. POST /api/inquiries: General inquiries with email notifications to tuhfatalilmacademy@gmail.com
 * 2. GET /api/inquiries: Inquiries list retrieval for admin portal
 * 3. OPTIONS: CORS preflight
 */

interface Env {
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
  EMAIL_TO?: string;
  [key: string]: any;
}

const DEFAULT_RECIPIENT = 'tuhfatalilmacademy@gmail.com';
const DEFAULT_SENDER = 'Tuhfat Al-Ilm Academy <onboarding@resend.dev>';

function corsResponse(body: any, status = 200) {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-email'
  };

  if (status === 204 || body === null) {
    return new Response(null, { status: 204, headers });
  }

  return new Response(typeof body === 'string' ? body : JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  });
}

function cleanPhoneForWhatsApp(phone: string): string {
  return (phone || '').replace(/[^0-9]/g, '');
}

function generateInquiryHtml(data: {
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
  const waLink = waNumber ? `https://wa.me/${waNumber}?text=${encodeURIComponent(`Assalamu Alaikum ${data.name}, this is Tuhfat Al-Ilm Academy regarding your academic inquiry (${data.id}).`)}` : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Academic Inquiry — Tuhfat Al-Ilm Academy</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF9F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E2320; line-height: 1.6;">
  <div style="max-width: 620px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);">
    
    <div style="background: linear-gradient(135deg, #064E3B 0%, #043D2E 100%); padding: 32px 28px; text-align: center; color: #ffffff;">
      <div style="font-size: 13px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #34D399; margin-bottom: 6px;">
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </div>
      <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
        New Academic Inquiry
      </h1>
      <p style="margin: 6px 0 0 0; font-size: 14px; color: #E2E8F0;">
        Tuhfat Al-Ilm Academy Admissions System
      </p>
    </div>

    <div style="background-color: #ECFDF5; border-bottom: 1px solid #A7F3D0; padding: 14px 28px; display: flex; justify-content: space-between; align-items: center;">
      <span style="font-size: 13px; font-weight: 600; color: #064E3B;">
        Reference: <strong style="font-family: monospace; font-size: 14px; color: #043D2E;">${data.id}</strong>
      </span>
      <span style="font-size: 12px; color: #059669; font-weight: 500;">
        Status: <strong>New Inquiry</strong>
      </span>
    </div>

    <div style="padding: 28px;">
      <p style="margin-top: 0; font-size: 15px; color: #334155;">
        Assalamu Alaikum,
      </p>
      <p style="font-size: 14px; color: #475569; margin-bottom: 24px;">
        A new prospective student has submitted an inquiry on the website:
      </p>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
        <tbody>
          <tr style="border-bottom: 1px solid #F1F5F9;">
            <td style="padding: 12px 8px; color: #64748B; font-weight: 600; width: 35%;">Name:</td>
            <td style="padding: 12px 8px; color: #0F172A; font-weight: 700;">${data.name}</td>
          </tr>
          ${data.parent_name ? `
          <tr style="border-bottom: 1px solid #F1F5F9;">
            <td style="padding: 12px 8px; color: #64748B; font-weight: 600;">Parent / Guardian:</td>
            <td style="padding: 12px 8px; color: #0F172A;">${data.parent_name}</td>
          </tr>` : ''}
          <tr style="border-bottom: 1px solid #F1F5F9;">
            <td style="padding: 12px 8px; color: #64748B; font-weight: 600;">Course of Interest:</td>
            <td style="padding: 12px 8px; color: #064E3B; font-weight: 700;">${data.course}</td>
          </tr>
          <tr style="border-bottom: 1px solid #F1F5F9;">
            <td style="padding: 12px 8px; color: #64748B; font-weight: 600;">WhatsApp / Phone:</td>
            <td style="padding: 12px 8px; color: #0F172A; font-family: monospace; font-size: 14px;">
              <a href="tel:${data.phone}" style="color: #064E3B; text-decoration: none; font-weight: 600;">${data.phone}</a>
            </td>
          </tr>
          ${data.email ? `
          <tr style="border-bottom: 1px solid #F1F5F9;">
            <td style="padding: 12px 8px; color: #64748B; font-weight: 600;">Email:</td>
            <td style="padding: 12px 8px; color: #0F172A;">
              <a href="mailto:${data.email}" style="color: #064E3B; text-decoration: underline;">${data.email}</a>
            </td>
          </tr>` : ''}
          <tr style="border-bottom: 1px solid #F1F5F9;">
            <td style="padding: 12px 8px; color: #64748B; font-weight: 600;">Schedule / Preferences:</td>
            <td style="padding: 12px 8px; color: #0F172A;">${data.preferred_time || data.preferred_date || 'Flexible'}</td>
          </tr>
          ${data.country ? `
          <tr style="border-bottom: 1px solid #F1F5F9;">
            <td style="padding: 12px 8px; color: #64748B; font-weight: 600;">Country / Timezone:</td>
            <td style="padding: 12px 8px; color: #0F172A;">${[data.country, data.timezone].filter(Boolean).join(' · ')}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 12px 8px; color: #64748B; font-weight: 600;">Submission Date:</td>
            <td style="padding: 12px 8px; color: #64748B; font-size: 13px;">${data.submitted_at}</td>
          </tr>
        </tbody>
      </table>

      ${data.message ? `
      <div style="background-color: #FAF9F5; border-left: 4px solid #064E3B; padding: 14px 18px; border-radius: 8px; margin-bottom: 24px;">
        <div style="font-size: 12px; font-weight: 700; color: #064E3B; text-transform: uppercase; margin-bottom: 4px;">
          Message / Question:
        </div>
        <p style="margin: 0; font-size: 14px; color: #334155; font-style: italic;">
          "${data.message}"
        </p>
      </div>` : ''}

      <div style="text-align: center; margin: 30px 0 10px 0;">
        ${waLink ? `
        <a href="${waLink}" style="display: inline-block; background-color: #059669; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 24px; border-radius: 10px; margin-right: 8px;">
          Open WhatsApp &rarr;
        </a>` : ''}
        <a href="https://tuhfatalilm.online/admin" style="display: inline-block; background-color: #064E3B; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 24px; border-radius: 10px;">
          Open Admin Portal &rarr;
        </a>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export async function onRequestOptions() {
  return corsResponse(null, 204);
}

export async function onRequestGet(context: any) {
  const kv = context.env?.INQUIRIES_KV || context.env?.KV;
  if (kv) {
    try {
      const raw = await kv.get('latest_inquiries');
      if (raw) {
        const parsed = JSON.parse(raw);
        return corsResponse({ success: true, inquiries: parsed, count: parsed.length });
      }
    } catch {}
  }
  return corsResponse({ success: true, inquiries: [] });
}

export async function onRequestPost(context: {
  request: Request;
  env: Env;
}) {
  try {
    let body: any = {};
    try {
      body = await context.request.json();
    } catch {
      return corsResponse({ error: 'Invalid JSON payload.' }, 400);
    }

    const name = (body.name || '').trim();
    const phone = (body.phone || '').trim();
    const email = (body.email || '').trim();
    const course = (body.course || 'General Academic Inquiry').trim();
    const parent_name = (body.parent_name || body.parentName || '').trim();
    const preferred_date = (body.preferred_date || body.preferredDate || '').trim();
    const preferred_time = (body.preferred_time || body.preferredTime || '').trim();
    const timezone = (body.timezone || '').trim();
    const country = (body.country || '').trim();
    const message = (body.message || '').trim();
    const source = (body.source || 'Contact Page - Academic Inquiry').trim();

    if (!name || !phone) {
      return corsResponse({ error: 'Name and Phone / WhatsApp number are required.' }, 400);
    }

    const bookingId = (body.id && body.id.startsWith('TAB-')) ? body.id : ('TAB-' + Math.floor(100000 + Math.random() * 900000));
    const now = new Date().toISOString();

    const record = {
      id: bookingId,
      name,
      parent_name,
      email,
      phone,
      course,
      preferred_date,
      preferred_time,
      timezone,
      country,
      message,
      source,
      status: 'New',
      created_at: now,
      updated_at: now
    };

    const recipient = context.env.EMAIL_TO || DEFAULT_RECIPIENT;
    const sender = context.env.EMAIL_FROM || DEFAULT_SENDER;
    const resendApiKey = context.env.RESEND_API_KEY;

    let emailSent = false;
    let emailStatus = 'pending_configuration';

    if (resendApiKey) {
      try {
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const payload: any = {
          from: sender,
          to: [recipient],
          subject: `New Inquiry — Tuhfat Al-Ilm Academy: ${name} (${course})`,
          html: generateInquiryHtml({ ...record, submitted_at: now }),
          text: `New inquiry from ${name} (${phone}, ${email}) regarding ${course}. Message: ${message}`
        };
        if (isValidEmail) payload.reply_to = email;

        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (resendRes.ok) {
          emailSent = true;
          emailStatus = 'sent';
        } else {
          emailStatus = 'failed';
        }
      } catch {
        emailStatus = 'failed';
      }
    }

    return corsResponse({
      success: true,
      bookingId,
      inquiryId: bookingId,
      booking: record,
      notification: { recipient, sent: emailSent, status: emailStatus },
      message: 'Inquiry saved successfully.'
    }, 201);
  } catch (err: any) {
    return corsResponse({ error: 'Failed to process inquiry.', details: err?.message }, 500);
  }
}
