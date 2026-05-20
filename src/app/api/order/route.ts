export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

// GET - Alle Bestellungen laden (für Admin-Dashboard)
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Fehler beim Laden der Bestellungen:', error);
    return NextResponse.json({ error: 'Fehler beim Laden' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Bestellung speichern
    const order = await prisma.order.create({
      data: {
        customerName: body.name || 'Unbekannt',
        customerEmail: body.email || 'keine@email.de',
        customerAddress: `${body.address || ''}, ${body.zip || ''} ${body.city || ''}`.trim() || 'Keine Adresse',
        subtotal: parseFloat(body.subtotal?.toString() || '0'),
        shippingCost: parseFloat(body.shippingCost?.toString() || '6.20'),
        totalAmount: parseFloat(body.totalAmount?.toString() || '0'),
        paymentMethod: body.paymentMethod || 'BANK_TRANSFER',
        itemsJson: body.items ? JSON.stringify(body.items) : '[]',
        status: body.paymentMethod === 'PAYPAL' ? 'PAID' : 'PENDING',
      }
    });

    // 2. Lagerbestand reduzieren
    if (body.items && body.items.length > 0) {
      for (const item of body.items) {
        try {
          const article = await (prisma as any).article.findUnique({ where: { id: item.id } });
          if (article) {
            const newStock = Math.max(0, article.stock - (item.quantity || 1));
            await (prisma as any).article.update({
              where: { id: item.id },
              data: { stock: newStock, isAvailable: newStock > 0 }
            });
          }
        } catch (e) {
          console.error('Lagerbestand Fehler:', e);
        }
      }
    }

    // 3. Artikelliste
    const itemList = body.items && body.items.length > 0
      ? body.items.map((item: any) => `- ${item.title} (${Number(item.price).toFixed(2)} EUR)`).join('\n')
      : 'Keine Artikel';

    const itemListHtml = body.items && body.items.length > 0
      ? body.items.map((item: any) => `<tr><td style="padding:8px 0;border-bottom:1px solid #f0ebe2;">${item.title}</td><td style="padding:8px 0;border-bottom:1px solid #f0ebe2;text-align:right;font-weight:700;">${Number(item.price).toFixed(2)} EUR</td></tr>`).join('')
      : '<tr><td>Keine Artikel</td></tr>';

    // 4. E-Mail
    const smtpEmail = process.env.SMTP_EMAIL?.trim();
    const smtpPassword = process.env.SMTP_PASSWORD?.replace(/\s/g, '');

    if (smtpEmail && smtpPassword) {
      try {
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: { user: smtpEmail, pass: smtpPassword },
        });

        // E-Mail an Bernd
        await transporter.sendMail({
          from: smtpEmail,
          to: 'berndos.shop@gmail.com',
          subject: `Neue Bestellung von ${order.customerName}`,
          text: `
Neue Bestellung!

KUNDE: ${order.customerName}
E-MAIL: ${order.customerEmail}
ADRESSE: ${order.customerAddress}

ARTIKEL:
${itemList}

Summe: ${order.subtotal.toFixed(2)} EUR
Versand: ${order.shippingCost.toFixed(2)} EUR
GESAMT: ${order.totalAmount.toFixed(2)} EUR

ZAHLUNG: ${order.paymentMethod}
ID: ${order.id}
          `.trim(),
        });

        // Bestätigungs-E-Mail an Kunden
        await transporter.sendMail({
          from: `"Berndos Flohmarkt" <${smtpEmail}>`,
          to: order.customerEmail,
          subject: `Deine Bestellung bei Berndos Flohmarkt`,
          html: `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#fdfaf5;font-family:Arial,sans-serif;color:#1c1917;">
<div style="max-width:600px;margin:0 auto;padding:40px 20px;">

  <div style="text-align:center;margin-bottom:32px;">
    <div style="display:inline-block;background:linear-gradient(135deg,#6d28d9,#a855f7);border-radius:16px;padding:16px 24px;margin-bottom:16px;">
      <span style="color:white;font-size:22px;font-weight:900;">Berndos Flohmarkt</span>
    </div>
    <h1 style="font-size:26px;font-weight:900;color:#1c1917;margin:0 0 8px;">Vielen Dank fuer deine Bestellung!</h1>
    <p style="color:#78716c;font-size:15px;margin:0;">Wir haben deine Bestellung erhalten und melden uns bald.</p>
  </div>

  <div style="background:white;border-radius:20px;padding:28px;margin-bottom:20px;border:1px solid #e7e0d5;">
    <h2 style="font-size:17px;font-weight:700;margin:0 0 16px;padding-bottom:12px;border-bottom:2px solid #f0ebe2;">Deine Artikel</h2>
    <table style="width:100%;border-collapse:collapse;">
      ${itemListHtml}
      <tr>
        <td style="padding:8px 0;color:#78716c;">Versandkosten (DHL)</td>
        <td style="padding:8px 0;text-align:right;color:#78716c;">${order.shippingCost.toFixed(2)} EUR</td>
      </tr>
      <tr style="border-top:2px solid #6d28d9;">
        <td style="padding:12px 0 0;font-weight:900;font-size:17px;">Gesamtbetrag</td>
        <td style="padding:12px 0 0;text-align:right;font-weight:900;font-size:17px;color:#6d28d9;">${order.totalAmount.toFixed(2)} EUR</td>
      </tr>
    </table>
  </div>

  <div style="background:white;border-radius:20px;padding:28px;margin-bottom:20px;border:1px solid #e7e0d5;">
    <h2 style="font-size:17px;font-weight:700;margin:0 0 12px;">Lieferadresse</h2>
    <p style="color:#78716c;margin:0;line-height:1.7;">${order.customerName}<br/>${order.customerAddress}</p>
  </div>

  <div style="background:${body.paymentMethod === 'PAYPAL' ? '#f0f9ff' : '#f5f0ff'};border-radius:20px;padding:28px;margin-bottom:20px;border:1px dashed ${body.paymentMethod === 'PAYPAL' ? '#0070ba' : '#a855f7'};">
    <h2 style="font-size:17px;font-weight:700;margin:0 0 12px;">Zahlungshinweis</h2>
    ${body.paymentMethod === 'PAYPAL' ? `
      <p style="color:#0070ba;font-weight:700;margin:0 0 8px;">PayPal:</p>
      <p style="margin:0 0 4px;">Bitte ueberweise manuell an:</p>
      <p style="font-weight:700;font-size:16px;margin:0;">berndos59@gmail.com</p>
    ` : `
      <p style="color:#6d28d9;font-weight:700;margin:0 0 8px;">Bankueberweisung / Vorkasse:</p>
      <p style="color:#78716c;margin:0 0 12px;">Bitte per Überweisung bezahlen.</p>
      <div style="background:white;border-radius:12px;padding:16px;">
        <div><strong>Inhaber:</strong> Bernd Geske</div>
        <div><strong>Betrag:</strong> ${order.totalAmount.toFixed(2)} EUR</div>
      </div>
    `}
  </div>

  <div style="background:white;border-radius:20px;padding:28px;margin-bottom:28px;border:1px solid #e7e0d5;">
    <h2 style="font-size:17px;font-weight:700;margin:0 0 16px;">Naechste Schritte</h2>
    <div style="line-height:1.8;color:#78716c;">
      <p style="margin:0 0 8px;">1. Überweise den Betrag wie oben beschrieben</p>
      <p style="margin:0 0 8px;">2. Nach Zahlungseingang versenden wir per DHL</p>
      <p style="margin:0;">3. Du erhältst die Sendungsverfolgung per E-Mail</p>
    </div>
  </div>

  <div style="text-align:center;color:#a8a29e;font-size:13px;">
    <p style="margin:0 0 8px;">Fragen? <a href="https://www.berndos-flohmarkt.de/kontakt" style="color:#6d28d9;">Kontakt</a></p>
    <p style="margin:0;">© ${new Date().getFullYear()} Berndos Flohmarkt</p>
  </div>

</div>
</body>
</html>
          `,
        });

        console.log('Beide E-Mails versendet');
      } catch (mailError) {
        console.error('Mail-Fehler:', mailError);
      }
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Order Fehler:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
