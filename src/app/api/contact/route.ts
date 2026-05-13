import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Bitte fülle alle Felder aus.' }, { status: 400 });
    }

    const smtpEmail = process.env.SMTP_EMAIL?.trim();
    const smtpPassword = process.env.SMTP_PASSWORD?.replace(/\s/g, '');
    const smtpHost = process.env.SMTP_HOST?.trim() || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT?.trim() || '465', 10);
    const smtpSecure = process.env.SMTP_SECURE?.trim().toLowerCase() === 'true' ? true : smtpPort === 465;
    const smtpFrom = process.env.SMTP_FROM?.trim() || smtpEmail;
    const adminEmail = process.env.ADMIN_EMAIL?.trim() || 'berndos.shop@gmail.com';

    if (smtpEmail && smtpPassword) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpEmail,
          pass: smtpPassword,
        },
      });

      const mailOptions = {
        from: smtpFrom,
        to: adminEmail,
        replyTo: email,
        subject: `Neue Kontaktanfrage von ${name}`,
        text: `Du hast eine neue Nachricht über das Kontaktformular erhalten.\n\nName: ${name}\nE-Mail: ${email}\n\nNachricht:\n${message}`,
      };

      await transporter.sendMail(mailOptions);
      return NextResponse.json({ success: true });
    } else {
      console.warn("SMTP settings are missing. Email not sent.");
      return NextResponse.json({ error: 'Der E-Mail Server ist noch nicht fertig konfiguriert.' }, { status: 500 });
    }
  } catch (error) {
    console.error('Contact Form Error:', error);
    return NextResponse.json({ error: 'Fehler beim Senden der Nachricht.' }, { status: 500 });
  }
}
