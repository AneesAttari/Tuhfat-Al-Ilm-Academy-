/**
 * Cloudflare Pages Function: /api/test-email
 * Allows the administrator to send an immediate test email to verify delivery
 * to tuhfatalilmacademy@gmail.com and aneesattari67@gmail.com, returning
 * comprehensive diagnostic telemetry from Resend and fallback channels.
 */

interface Env {
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
  EMAIL_TO?: string;
  [key: string]: any;
}

function corsResponse(body: any, status = 200) {
  return new Response(typeof body === 'string' ? body : JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-email'
    }
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-email'
    }
  });
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    let body: any = {};
    try {
      body = await context.request.json();
    } catch {}

    const targetEmail = (body.email || context.env.EMAIL_TO || 'tuhfatalilmacademy@gmail.com').trim().toLowerCase();
    const apiKey = context.env.RESEND_API_KEY;
    const sender = context.env.EMAIL_FROM || 'Tuhfat Al-Ilm Academy <onboarding@resend.dev>';
    const now = new Date().toISOString();

    const diagnostics: any = {
      timestamp: now,
      targetEmail,
      configuredSender: sender,
      hasResendApiKey: Boolean(apiKey),
      resendLength: apiKey ? apiKey.length : 0,
      resendResults: [],
      formSubmitResult: null
    };

    // 1. Test via Resend if key is present
    if (apiKey) {
      // First attempt to targetEmail
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: sender,
            to: [targetEmail],
            subject: `[Verified Test] Tuhfat Al-Ilm Academy Email System (${now.slice(11, 19)} UTC)`,
            html: `
              <div style="font-family:sans-serif;padding:24px;background:#FAF9F5;border-radius:12px;max-width:550px;margin:auto;">
                <h2 style="color:#064E3B;margin-top:0;">Email Verification Successful!</h2>
                <p style="color:#334155;">Assalamu Alaikum. This test email confirms that your Tuhfat Al-Ilm Academy email dispatch system is operational and successfully delivering notifications to <strong>${targetEmail}</strong>.</p>
                <div style="background:#ECFDF5;padding:12px;border-radius:8px;border:1px solid #A7F3D0;font-size:13px;color:#064E3B;">
                  Dispatched from Cloudflare at: <strong>${now}</strong>
                </div>
              </div>
            `,
            text: `Assalamu Alaikum. This test email confirms that your Tuhfat Al-Ilm Academy email dispatch system is operational and delivering to ${targetEmail}. Sent at: ${now}`
          })
        });

        const status = resendRes.status;
        const resText = await resendRes.text();
        let parsed: any = null;
        try { parsed = JSON.parse(resText); } catch {}

        diagnostics.resendResults.push({
          recipient: targetEmail,
          status,
          success: resendRes.ok,
          response: parsed || resText
        });

        // If Resend failed with 403 (unverified domain / restricted to registered email), and targetEmail != aneesattari67@gmail.com, retry to aneesattari67@gmail.com
        if (!resendRes.ok && targetEmail !== 'aneesattari67@gmail.com') {
          try {
            const fallbackRes = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                from: sender,
                to: ['aneesattari67@gmail.com'],
                subject: `[Owner Verification] Tuhfat Al-Ilm Academy Email System`,
                text: `Assalamu Alaikum. Resend test email dispatched directly to owner address aneesattari67@gmail.com. Sent at: ${now}`
              })
            });
            const fbText = await fallbackRes.text();
            let fbParsed: any = null;
            try { fbParsed = JSON.parse(fbText); } catch {}
            diagnostics.resendResults.push({
              recipient: 'aneesattari67@gmail.com',
              status: fallbackRes.status,
              success: fallbackRes.ok,
              response: fbParsed || fbText
            });
          } catch (e: any) {
            diagnostics.resendResults.push({ recipient: 'aneesattari67@gmail.com', error: e.message });
          }
        }
      } catch (sendErr: any) {
        diagnostics.resendResults.push({ recipient: targetEmail, error: sendErr.message });
      }
    }

    // 2. Dispatch via FormSubmit fallback channel with Origin headers
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
          _subject: `[Test Notification] Tuhfat Al-Ilm Academy Email Verification`,
          _cc: 'aneesattari67@gmail.com',
          Message: `Assalamu Alaikum. This test email confirms that admissions notifications from Tuhfat Al-Ilm Academy are successfully arriving in your Gmail inbox (${targetEmail}).`,
          Timestamp: now
        })
      });

      const fsText = await fsRes.text();
      let fsJson: any = null;
      try { fsJson = JSON.parse(fsText); } catch {}
      diagnostics.formSubmitResult = {
        status: fsRes.status,
        response: fsJson || fsText
      };
    } catch (fsErr: any) {
      diagnostics.formSubmitResult = { error: fsErr.message };
    }

    const overallSuccess = diagnostics.resendResults.some((r: any) => r.success) ||
      (diagnostics.formSubmitResult?.response?.success === 'true' || diagnostics.formSubmitResult?.response?.success === true);

    return corsResponse({
      success: overallSuccess,
      message: overallSuccess
        ? 'Test email successfully dispatched! Check your Gmail inbox (and Spam/Junk folder).'
        : 'Dispatched test email. Please review the diagnostic log below.',
      diagnostics
    });
  } catch (err: any) {
    return corsResponse({
      success: false,
      error: err?.message || String(err)
    }, 500);
  }
}
