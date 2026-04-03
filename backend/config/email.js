const nodemailer = require("nodemailer");

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};

const sendLoginNotification = async (email, name, ip = "unknown") => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("📧 Email not configured — skipping login notification");
    return;
  }
  try {
    const time = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "short",
    });

    await getTransporter().sendMail({
      from: process.env.EMAIL_FROM || `"CampusBloom" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎓 New Login to CampusBloom",
      html: `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f5f0ff;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(168,85,247,0.12);max-width:100%;">
        <tr><td style="background:linear-gradient(135deg,#a855f7,#ec4899);padding:32px;text-align:center;">
          <div style="font-size:44px;margin-bottom:8px;">🎓</div>
          <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800;">CampusBloom</h1>
          <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:14px;">Your college life, beautifully organized</p>
        </td></tr>
        <tr><td style="padding:32px;">
          <h2 style="color:#2d1b69;font-size:18px;margin:0 0 14px;">Hey ${name}! 👋</h2>
          <p style="color:#555;font-size:14px;line-height:1.7;margin:0 0 20px;">
            A new login was detected on your <strong>CampusBloom</strong> account.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f5ff;border-radius:12px;overflow:hidden;margin-bottom:22px;">
            <tr><td style="padding:14px 18px;border-bottom:1px solid #ede9fe;">
              <span style="color:#7c6faa;font-size:12px;font-weight:600;">📅 TIME</span><br>
              <span style="color:#2d1b69;font-size:14px;font-weight:700;">${time} (IST)</span>
            </td></tr>
            <tr><td style="padding:14px 18px;border-bottom:1px solid #ede9fe;">
              <span style="color:#7c6faa;font-size:12px;font-weight:600;">📧 ACCOUNT</span><br>
              <span style="color:#2d1b69;font-size:14px;font-weight:700;">${email}</span>
            </td></tr>
            <tr><td style="padding:14px 18px;">
              <span style="color:#7c6faa;font-size:12px;font-weight:600;">🌐 IP ADDRESS</span><br>
              <span style="color:#2d1b69;font-size:14px;font-weight:700;">${ip}</span>
            </td></tr>
          </table>
          <p style="color:#555;font-size:13px;line-height:1.6;margin:0 0 20px;">
            If this was you, you're all set! 🎉<br>
            If you didn't sign in, please <strong>change your password immediately</strong>.
          </p>
          <div style="background:linear-gradient(135deg,#a855f7,#ec4899);border-radius:12px;padding:14px;text-align:center;">
            <p style="color:#fff;font-size:13px;font-weight:600;margin:0;">
              🌸 Keep studying, keep growing. You've got this!
            </p>
          </div>
          <p style="color:#bbb;font-size:11px;text-align:center;margin-top:20px;">
            Automated security notification — do not reply.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    });
    console.log(`📧 Login notification sent to ${email}`);
  } catch (err) {
    // Non-fatal — login still proceeds
    console.error("📧 Email send error (non-fatal):", err.message);
  }
};

module.exports = { sendLoginNotification };
