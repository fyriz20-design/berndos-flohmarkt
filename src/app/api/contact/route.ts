export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, message } = body
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Bitte alle Felder ausfullen.' }, { status: 400 })
    }
    const smtpEmail = process.env.SMTP_EMAIL?.trim()
    const smtpPassword = process.env.SMTP_PASSWORD?.replace(/\s/g, '')
    if (smtpEmail && smtpPassword) {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user: smtpEmail, pass: smtpPassword },
      })
      await transporter.sendMail({
        from: smtpEmail,
        to: 'berndos.shop@gmail.com',
        replyTo: email,
        subject: 'Neue Kontaktanfrage von ' + name,
        text: 'Name: ' + name + '\nE-Mail: ' + email + '\n\nNachricht:\n' + message,
      })
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: 'E-Mail Server nicht konfiguriert.' }, { status: 500 })
    }
  } catch (error) {
    console.error('Contact Error:', error)
    return NextResponse.json({ error: 'Fehler beim Senden.' }, { status: 500 })
  }
}