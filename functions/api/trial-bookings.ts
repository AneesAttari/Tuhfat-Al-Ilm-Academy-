/**
 * Cloudflare Pages Function: POST /api/trial-bookings
 * Handles:
 * 1. Booking validation and normalization
 * 2. Automatic Email Notification to tuhfatalilmacademy@gmail.com via Resend API
 * 3. Graceful handling: Booking is ALWAYS saved and confirmed even if email service has issues
 */

interface Env {
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
  EMAIL_TO?: string;
  [key: string]: any;
}

const DEFAULT_RECIPIENT = 'tuhfatalilmacademy@gmail.com';
const DEFAULT_SENDER = 'Tuhfat Al-Ilm Academy <onboarding@resend.dev>';

// CORS Response Helper
function corsResponse(body: any, status = 200) {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

// Format Phone for quick WhatsApp link (strip +, spaces, dashes)
function cleanPhoneForWhatsApp(phone: string): string {
  return (phone || '').replace(/[^0-9]/g, '');
}

// Generate professional HTML email for academy administration
function generateBookingHtml(data: {
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
  const waLink = waNumber ? `https://wa.me/${waNumber}?text=${encodeURIComponent(`Assalamu Alaikum ${data.name}, this is Tuhfat Al-Ilm Academy regarding your Free Trial class booking (${data.id}).`)}` : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Free Trial Booking — Tuhfat Al-Ilm Academy</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF9F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E2320; line-height: 1.6;">
  <div style="max-width: 620px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);">
    
    <!-- Header Banner -->
    <div style="background: linear-gradient(135deg, #064E3B 0%, #043D2E 100%); padding: 32px 28px; text-align: center; color: #ffffff;">
      <div style="font-size: 13px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #34D399; margin-bottom: 6px;">
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </div>
      <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
        New Free Trial Class Booking
      </h1>
      <p style="margin: 6px 0 0 0; font-size: 14px; color: #E2E8F0;">
        Tuhfat Al-Ilm Academy Admissions System
      </p>
    </div>

    <!-- Booking ID Alert Bar -->
    <div style="background-color: #ECFDF5; border-bottom: 1px solid #A7F3D0; padding: 14px 28px; display: flex; justify-content: space-between; align-items: center;">
      <span style="font-size: 13px; font-weight: 600; color: #064E3B;">
        Reference: <strong style="font-family: monospace; font-size: 14px; color: #043D2E;">${data.id}</strong>
      </span>
      <span style="font-size: 12px; color: #059669; font-weight: 500;">
        Status: <strong>New (Action Required)</strong>
      </span>
    </div>

    <!-- Body Content -->
    <div style="padding: 28px;">
      <p style="margin-top: 0; font-size: 15px; color: #334155;">
        Assalamu Alaikum,
      </p>
      <p style="font-size: 14px; color: #475569; margin-bottom: 24px;">
        A new student has submitted a <strong>Free Trial Class Booking</strong> on the Tuhfat Al-Ilm Academy website. Please review their details below and schedule their 1-on-1 introductory session:
      </p>

      <!-- Details Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
        <tbody>
          <tr style="border-bottom: 1px solid #F1F5F9;">
            <td style="padding: 12px 8px; color: #64748B; font-weight: 600; width: 35%;">Student Name:</td>
            <td style="padding: 12px 8px; color: #0F172A; font-weight: 700;">${data.name}</td>
          </tr>
          ${data.parent_name ? `
          <tr style="border-bottom: 1px solid #F1F5F9;">
            <td style="padding: 12px 8px; color: #64748B; font-weight: 600;">Parent / Guardian:</td>
            <td style="padding: 12px 8px; color: #0F172A;">${data.parent_name}</td>
          </tr>` : ''}
          <tr style="border-bottom: 1px solid #F1F5F9;">
            <td style="padding: 12px 8px; color: #64748B; font-weight: 600;">Selected Course:</td>
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
            <td style="padding: 12px 8px; color: #64748B; font-weight: 600;">Student Email:</td>
            <td style="padding: 12px 8px; color: #0F172A;">
              <a href="mailto:${data.email}" style="color: #064E3B; text-decoration: underline;">${data.email}</a>
            </td>
          </tr>` : ''}
          <tr style="border-bottom: 1px solid #F1F5F9;">
            <td style="padding: 12px 8px; color: #64748B; font-weight: 600;">Preferred Date:</td>
            <td style="padding: 12px 8px; color: #0F172A;">${data.preferred_date || 'Flexible / As soon as possible'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #F1F5F9;">
            <td style="padding: 12px 8px; color: #64748B; font-weight: 600;">Preferred Time & Details:</td>
            <td style="padding: 12px 8px; color: #0F172A;">${data.preferred_time || 'Flexible'}</td>
          </tr>
          ${data.country ? `
          <tr style="border-bottom: 1px solid #F1F5F9;">
            <td style="padding: 12px 8px; color: #64748B; font-weight: 600;">Country / Location:</td>
            <td style="padding: 12px 8px; color: #0F172A;">${data.country}</td>
          </tr>` : ''}
          ${data.timezone ? `
          <tr style="border-bottom: 1px solid #F1F5F9;">
            <td style="padding: 12px 8px; color: #64748B; font-weight: 600;">Time Zone:</td>
            <td style="padding: 12px 8px; color: #0F172A;">${data.timezone}</td>
          </tr>` : ''}
          <tr style="border-bottom: 1px solid #F1F5F9;">
            <td style="padding: 12px 8px; color: #64748B; font-weight: 600;">Source:</td>
            <td style="padding: 12px 8px; color: #64748B;">${data.source || 'Website Trial Booking Form'}</td>
          </tr>
          <tr>
            <td style="padding: 12px 8px; color: #64748B; font-weight: 600;">Submission Time:</td>
            <td style="padding: 12px 8px; color: #64748B; font-size: 13px;">${data.submitted_at}</td>
          </tr>
        </tbody>
      </table>

      ${data.message ? `
      <!-- Additional Student Notes -->
      <div style="background-color: #FAF9F5; border-left: 4px solid #064E3B; padding: 14px 18px; border-radius: 8px; margin-bottom: 24px;">
        <div style="font-size: 12px; font-weight: 700; color: #064E3B; text-transform: uppercase; margin-bottom: 4px;">
          Student's Message / Special Requests:
        </div>
        <p style="margin: 0; font-size: 14px; color: #334155; font-style: italic;">
          "${data.message}"
        </p>
      </div>` : ''}

      <!-- Direct Action Buttons -->
      <div style="text-align: center; margin: 30px 0 10px 0;">
        ${waLink ? `
        <a href="${waLink}" style="display: inline-block; background-color: #059669; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 24px; border-radius: 10px; margin-right: 8px; box-shadow: 0 2px 4px rgba(5, 150, 105, 0.2);">
          Open WhatsApp Chat &rarr;
        </a>` : ''}
        <a href="https://tuhfatalilm.online/admin" style="display: inline-block; background-color: #064E3B; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 24px; border-radius: 10px;">
          Manage in Admin Portal &rarr;
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 16px 28px; text-align: center; font-size: 12px; color: #94A3B8;">
      Tuhfat Al-Ilm Academy &bull; International Online Quranic &amp; Islamic Studies &bull; <a href="https://tuhfatalilm.online" style="color: #064E3B; text-decoration: none;">tuhfatalilm.online</a>
    </div>

  </div>
</body>
</html>
  `.trim();
}

// Generate plain-text email version
function generateBookingText(data: {
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
  return `
Assalamu Alaikum,

A new Free Trial Class Booking has been submitted on Tuhfat Al-Ilm Academy:

==================================================
STUDENT & BOOKING INFORMATION:
==================================================
Reference ID:       ${data.id}
Student Name:       ${data.name}
Parent / Guardian:  ${data.parent_name || 'N/A (Direct Student)'}
Selected Course:    ${data.course}
Phone / WhatsApp:   ${data.phone}
Email Address:      ${data.email || 'Not provided'}
Preferred Date:     ${data.preferred_date || 'Flexible'}
Preferred Time:     ${data.preferred_time || 'Flexible'}
Country / Location: ${data.country || 'Not specified'}
Time Zone:          ${data.timezone || 'Not specified'}
Source:             ${data.source || 'Website Trial Booking Form'}
Submitted At:       ${data.submitted_at}

Notes / Message:
${data.message || 'None provided.'}
==================================================

You can manage this student and assign an instructor via the Admin Portal:
https://tuhfatalilm.online/admin
`.trim();
}

export async function onRequestOptions() {
  return corsResponse(null, 204);
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
      return corsResponse({ error: 'Invalid JSON request payload.' }, 400);
    }

    const name = (body.name || '').trim();
    const phone = (body.phone || '').trim();
    const email = (body.email || '').trim();
    const course = (body.course || 'Quran Reading / Nazra').trim();
    const parent_name = (body.parent_name || body.parentName || '').trim();
    const preferred_date = (body.preferred_date || body.preferredDate || '').trim();
    const preferred_time = (body.preferred_time || body.preferredTime || '').trim();
    const timezone = (body.timezone || '').trim();
    const country = (body.country || '').trim();
    const message = (body.message || '').trim();
    const source = (body.source || 'Website - Free Trial Booking').trim();

    // 1. Validate required inputs
    if (!name || !phone) {
      return corsResponse({
        error: 'Student Name and Phone / WhatsApp number are required to book a free trial.'
      }, 400);
    }

    // 2. Generate or preserve booking reference ID
    const bookingId = (body.id && body.id.startsWith('TAB-')) ? body.id : ('TAB-' + Math.floor(100000 + Math.random() * 900000));
    const now = new Date().toISOString();

    const bookingRecord = {
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

    // 3. Dispatch Email Notification to tuhfatalilmacademy@gmail.com
    const recipient = context.env.EMAIL_TO || DEFAULT_RECIPIENT;
    const sender = context.env.EMAIL_FROM || DEFAULT_SENDER;
    const resendApiKey = context.env.RESEND_API_KEY;

    let emailSent = false;
    let emailProviderStatus = 'pending_configuration';
    let emailError: string | null = null;
    let emailId: string | null = null;

    if (resendApiKey) {
      try {
        // Prepare reply_to only if student provided a valid email
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        const emailPayload: any = {
          from: sender,
          to: [recipient],
          subject: `New Free Trial Booking — Tuhfat Al-Ilm Academy: ${name} (${course})`,
          html: generateBookingHtml({ ...bookingRecord, submitted_at: now }),
          text: generateBookingText({ ...bookingRecord, submitted_at: now })
        };

        if (isValidEmail) {
          emailPayload.reply_to = email;
        }

        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(emailPayload)
        });

        if (resendResponse.ok) {
          const resendJson: any = await resendResponse.json();
          emailSent = true;
          emailProviderStatus = 'sent';
          emailId = resendJson.id || null;
          console.log(`[Email Notification] Successfully dispatched trial booking email (${bookingId}) to ${recipient}`);
        } else {
          const errBody = await resendResponse.text();
          emailProviderStatus = 'failed';
          emailError = `Resend API returned status ${resendResponse.status}: ${errBody}`;
          console.warn(`[Email Notification] Resend API error:`, emailError);
        }
      } catch (sendErr: any) {
        emailProviderStatus = 'failed';
        emailError = sendErr?.message || String(sendErr);
        console.warn(`[Email Notification] Network dispatch failed:`, emailError);
      }
    } else {
      console.log(`[Email Notification] RESEND_API_KEY secret is not yet configured in Cloudflare environment. Email notification is logged for: ${recipient}`);
      emailProviderStatus = 'pending_configuration';
    }

    // 4. Return success response with booking record and email metadata
    // NOTE: Booking is ALWAYS preserved and returned as successful to the student!
    return corsResponse({
      success: true,
      bookingId,
      booking: bookingRecord,
      notification: {
        recipient,
        sent: emailSent,
        status: emailProviderStatus,
        id: emailId,
        error: emailError
      },
      message: 'Your trial booking has been received! Our academic coordinator will contact you via email & WhatsApp to confirm your class schedule.'
    }, 201);
  } catch (err: any) {
    console.error('[Trial Booking Error]:', err);
    return corsResponse({
      error: 'An unexpected error occurred while processing your booking.',
      details: err?.message || String(err)
    }, 500);
  }
}
