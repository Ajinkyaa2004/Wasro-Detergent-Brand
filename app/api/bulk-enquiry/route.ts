import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { SITE } from "@/lib/utils";

// Node runtime — nodemailer needs native modules, not Edge.
export const runtime = "nodejs";
// Force dynamic — never cached.
export const dynamic = "force-dynamic";

type Payload = {
  name?: string;
  business?: string;
  phone?: string;
  email?: string;
  city?: string;
  buyer_type?: string;
  quantity?: string;
  message?: string;
  _honey?: string;
};

function clean(s: unknown, max = 500): string {
  if (typeof s !== "string") return "";
  return s.trim().slice(0, max);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildHtml(d: Required<Omit<Payload, "_honey">>): string {
  const rows = (
    [
      ["Name", d.name],
      ["Business", d.business || "—"],
      ["Phone (WhatsApp)", d.phone],
      ["Email", d.email],
      ["City", d.city],
      ["Buyer type", d.buyer_type],
      ["Quantity", d.quantity],
    ] as const
  )
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 14px;background:#F8FAFD;border:1px solid #E3EEF8;font-size:12px;font-weight:600;color:#0F4275;text-transform:uppercase;letter-spacing:0.06em;width:160px;">${escapeHtml(label)}</td>
          <td style="padding:10px 14px;border:1px solid #E3EEF8;font-size:14px;color:#1A1A1A;">${escapeHtml(value)}</td>
        </tr>`
    )
    .join("");

  const noteHtml = d.message
    ? `<p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#0F4275;text-transform:uppercase;letter-spacing:0.06em;">Notes from buyer</p>
       <div style="padding:14px 16px;background:#FFF8E1;border:1px solid #F4D34A;border-radius:8px;font-size:14px;line-height:1.55;color:#1A1A1A;white-space:pre-wrap;">${escapeHtml(d.message)}</div>`
    : "";

  return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#F2F6FB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#FFFFFF;border-radius:14px;overflow:hidden;box-shadow:0 8px 30px -12px rgba(15,66,117,0.18);">
    <tr><td style="padding:24px 28px;background:linear-gradient(135deg,#1B5FA8,#0F4275);color:#FFFFFF;">
      <div style="font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;opacity:0.85;">Wasro · Bulk Orders</div>
      <h1 style="margin:6px 0 0;font-size:22px;font-weight:700;">New bulk enquiry</h1>
      <div style="margin-top:4px;font-size:13px;opacity:0.85;">From wasro.in/bulk-orders · ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })} IST</div>
    </td></tr>
    <tr><td style="padding:24px 28px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:20px;">
        ${rows}
      </table>
      ${noteHtml}
      <div style="margin-top:24px;padding-top:18px;border-top:1px dashed #E3EEF8;font-size:12px;color:#5F6B7A;">
        Reply within 1 working day · WhatsApp: <a href="https://wa.me/${SITE.whatsapp}" style="color:#1B5FA8;text-decoration:none;">${SITE.whatsappDisplay}</a>
      </div>
    </td></tr>
  </table>
</body></html>`;
}

function buildText(d: Required<Omit<Payload, "_honey">>): string {
  return [
    "=== New bulk enquiry — Wasro ===",
    "",
    `Name:           ${d.name}`,
    `Business:       ${d.business || "—"}`,
    `Phone:          ${d.phone}`,
    `Email:          ${d.email}`,
    `City:           ${d.city}`,
    `Buyer type:     ${d.buyer_type}`,
    `Quantity:       ${d.quantity}`,
    "",
    "Notes:",
    d.message || "—",
    "",
    `Received: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST`,
    `(Sent from wasro.in/bulk-orders)`,
  ].join("\n");
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot — silently accept and discard
  if (body._honey) {
    return NextResponse.json({ ok: true });
  }

  const data = {
    name: clean(body.name, 120),
    business: clean(body.business, 160),
    phone: clean(body.phone, 40),
    email: clean(body.email, 200),
    city: clean(body.city, 100),
    buyer_type: clean(body.buyer_type, 60),
    quantity: clean(body.quantity, 300),
    message: clean(body.message, 2000),
  };

  // Required fields
  for (const k of ["name", "phone", "email", "city", "buyer_type", "quantity"] as const) {
    if (!data[k]) {
      return NextResponse.json(
        { error: `Missing required field: ${k}` },
        { status: 400 }
      );
    }
  }

  // Light email-shape check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  // SMTP config — read at request time so dev-server picks up .env changes on restart.
  const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
  const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
  const SMTP_SECURE =
    process.env.SMTP_SECURE != null
      ? process.env.SMTP_SECURE === "true"
      : SMTP_PORT === 465;
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;
  const MAIL_TO = process.env.MAIL_TO || SITE.email;
  const MAIL_FROM =
    process.env.MAIL_FROM ||
    (SMTP_USER ? `Wasro Website <${SMTP_USER}>` : undefined);

  if (!SMTP_USER || !SMTP_PASS || !MAIL_FROM) {
    console.error(
      "[bulk-enquiry] SMTP env vars not configured. Set SMTP_USER, SMTP_PASS in .env.local"
    );
    return NextResponse.json(
      {
        error:
          "Mail service not configured. Please WhatsApp us at " +
          SITE.whatsappDisplay,
      },
      { status: 503 }
    );
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  try {
    await transporter.sendMail({
      from: MAIL_FROM,
      to: MAIL_TO,
      replyTo: `${data.name} <${data.email}>`,
      subject: `New bulk enquiry — ${data.name}${data.business ? ` (${data.business})` : ""}`,
      text: buildText(data),
      html: buildHtml(data),
    });
  } catch (err) {
    console.error("[bulk-enquiry] sendMail failed:", err);
    return NextResponse.json(
      {
        error:
          "Could not send your enquiry right now. Please WhatsApp us at " +
          SITE.whatsappDisplay,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
