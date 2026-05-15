import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Bestellung in Datenbank speichern
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

    console.log('✅ Order erstellt:', order.id);

    // 2. Artikel-Lagerbestand reduzieren & ausblenden wenn ausverkauft
    if (body.items && body.items.length > 0) {
      for (const item of body.items) {
        try {
          const article = await (prisma as any).article.findUnique({ where: { id: item.id } });
          if (article) {
            const newStock = Math.max(0, article.stock - (item.quantity || 1));
            await (prisma as any).article.update({
              where: { id: item.id },
              data: {
                stock: newStock,
                isAvailable: newStock > 0,
              }
            });
          }
        } catch (e) {
          console.error('Fehler beim Lagerbestand aktualisieren:', e);
        }
      }
    }

    // 3. Artikelliste aufbereiten
    const itemList = body.items && body.items.length > 0
      ? body.items.map((item: any) => `- ${item.title} (${Number(item.price).toFixed(2)} EUR)`).join('\n')
      : 'Keine Artikel Details';

    const itemListHtml = body.items && body.items.length > 0
      ? body.items.map((item: any) => `<tr><td style="padding: 8px 0; border-bottom: 1px solid #f0ebe2;">${item.title}</td><td style="padding: 8px 0; border-bottom: 1px solid #f0ebe2; text-align: right; font-weight: 700;">${Number(item.price).toFixed(2)} €</td></tr>`).join('')
      : '<tr><td>Keine Artikel</td></tr>';

    // 4. Zahlungsinfo
    const paymentInfo = body.paymentMethod === 'PAYPAL'
      ? 'PayPal – Bitte manuell überweisen, siehe E-Mail Adresse'
      : 'Banküberweisung / Vorkasse – Bitte in Echtzeitüberweisung';

    // 5. E-Mail Konfiguration
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

        // === E-MAIL AN BERND (Verkäufer) ===
        await transporter.sendMail({
          from: smtpEmail,
          to: 'berndos.shop@gmail.com',
          subject: `🛒 Neue Bestellung von ${order.customerName}`,
          text: `
Neue Bestellung eingegangen!

KUNDE: ${order.customerName}
E-MAIL: ${order.customerEmail}
ADRESSE: ${order.customerAddress}

GEKAUFTE ARTIKEL:
${itemList}

DETAILS:
Summe: ${order.subtotal.toFixed(2)} EUR
Versand: ${order.shippingCost.toFixed(2)} EUR
GESAMT: ${order.totalAmount.toFixed(2)} EUR

ZAHLUNGSMETHODE: ${paymentInfo}
Bestell-ID: ${order.id}
          `.trim(),
        });

        // === BESTÄTIGUNGS-E-MAIL AN KUNDEN ===
        await transporter.sendMail({
          from: `"Berndos Flohmarkt" <${smtpEmail}>`,
          to: order.customerEmail,
          subject: `✅ Deine Bestellung bei Berndos Flohmarkt`,
          html: `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #fdfaf5; font-family: 'DM Sans', Arial, sans-serif; color: #1c1917;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="display: inline-block; background: linear-gradient(135deg, #6d28d9, #a855f7); border-radius: 16px; padding: 16px 24px; margin-bottom: 16px;">
        <span style="color: white; font-size: 24px; font-weight: 900;">🏪 Berndos Flohmarkt</span>
      </div>
      <h1 style="font-size: 28px; font-weight: 900; color: #1c1917; margin: 0 0 8px;">Vielen Dank für deine Bestellung!</h1>
      <p style="color: #78716c; font-size: 16px; margin: 0;">Wir haben deine Bestellung erhalten und melden uns bald bei dir.</p>
    </div>

    <!-- Bestelldetails -->
    <div style="background: white; border-radius: 20px; padding: 28px; margin-bottom: 20px; border: 1px solid #e7e0d5; box-shadow: 0 4px 16px rgba(120,80,20,0.07);">
      <h2 style="font-size: 18px; font-weight: 700; color: #1c1917; margin: 0 0 16px; padding-bottom: 12px; border-bottom: 2px solid #f0ebe2;">📦 Deine Artikel</h2>
      <table style="width: 100%; border-collapse: collapse;">
        ${itemListHtml}
        <tr>
          <td style="padding: 8px 0; color: #78716c;">Versandkosten (DHL)</td>
          <td style="padding: 8px 0; text-align: right; color: #78716c;">${order.shippingCost.toFixed(2)} €</td>
        </tr>
        <tr style="border-top: 2px solid #6d28d9;">
          <td style="padding: 12px 0 0; font-weight: 900; font-size: 18px;">Gesamtbetrag</td>
          <td style="padding: 12px 0 0; text-align: right; font-weight: 900; font-size: 18px; color: #6d28d9;">${order.totalAmount.toFixed(2)} €</td>
        </tr>
      </table>
    </div>

    <!-- Lieferadresse -->
    <div style="background: white; border-radius: 20px; padding: 28px; margin-bottom: 20px; border: 1px solid #e7e0d5; box-shadow: 0 4px 16px rgba(120,80,20,0.07);">
      <h2 style="font-size: 18px; font-weight: 700; color: #1c1917; margin: 0 0 12px;">📍 Lieferadresse</h2>
      <p style="color: #78716c; margin: 0; line-height: 1.7; font-size: 15px;">${order.customerName}<br/>${order.customerAddress}</p>
    </div>

    <!-- Zahlungsinfo -->
    <div style="background: ${body.paymentMethod === 'PAYPAL' ? '#f0f9ff' : '#f5f0ff'}; border-radius: 20px; padding: 28px; margin-bottom: 20px; border: 1px dashed ${body.paymentMethod === 'PAYPAL' ? '#0070ba' : '#a855f7'};">
      <h2 style="font-size: 18px; font-weight: 700; color: #1c1917; margin: 0 0 12px;">💳 Zahlungshinweis</h2>
      ${body.paymentMethod === 'PAYPAL' ? `
        <p style="color: #0070ba; font-weight: 700; margin: 0 0 8px; font-size: 16px;">PayPal Zahlung:</p>
        <p style="color: #1c1917; margin: 0 0 8px; font-size: 15px;">Bitte überweise den Betrag manuell an:</p>
        <p style="color: #1c1917; font-weight: 700; font-size: 16px; margin: 0;">berndos59@gmail.com</p>
      ` : `
        <p style="color: #6d28d9; font-weight: 700; margin: 0 0 12px; font-size: 16px;">Banküberweisung / Vorkasse:</p>
        <p style="color: #78716c; margin: 0 0 4px; font-size: 15px;">Bitte überweise den Betrag in Echtzeitüberweisung an:</p>
        <div style="background: white; border-radius: 12px; padding: 16px; margin-top: 12px; font-size: 15px; line-height: 1.8;">
          <div><strong>Inhaber:</strong> Bernd Geske</div>
          <div><strong>Betrag:</strong> ${order.totalAmount.toFixed(2)} €</div>
        </div>
      `}
    </div>

    <!-- Nächste Schritte -->
    <div style="background: white; border-radius: 20px; padding: 28px; margin-bottom: 28px; border: 1px solid #e7e0d5; box-shadow: 0 4px 16px rgba(120,80,20,0.07);">
      <h2 style="font-size: 18px; font-weight: 700; color: #1c1917; margin: 0 0 16px;">🚀 Nächste Schritte</h2>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; align-items: flex-start; gap: 12px;">
          <span style="font-size: 20px; flex-shrink: 0;">1️⃣</span>
          <span style="color: #78716c; font-size: 15px; line-height: 1.6;">Überweise den Betrag wie oben beschrieben</span>
        </div>
        <div style="display: flex; align-items: flex-start; gap: 12px;">
          <span style="font-size: 20px; flex-shrink: 0;">2️⃣</span>
          <span style="color: #78716c; font-size: 15px; line-height: 1.6;">Nach Zahlungseingang verpacken und versenden wir deinen Artikel per DHL</span>
        </div>
        <div style="display: flex; align-items: flex-start; gap: 12px;">
          <span style="font-size: 20px; flex-shrink: 0;">3️⃣</span>
          <span style="color: #78716c; font-size: 15px; line-height: 1.6;">Du erhältst die Sendungsverfolgungsnummer per E-Mail</span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; color: #a8a29e; font-size: 13px; line-height: 1.6;">
      <p style="margin: 0 0 8px;">Bei Fragen schreib uns: <a href="https://www.berndos-flohmarkt.de/kontakt" style="color: #6d28d9; text-decoration: none;">berndos-flohmarkt.de/kontakt</a></p>
      <p style="margin: 0;">© ${new Date().getFullYear()} Berndos Flohmarkt · Privater Verkauf</p>
    </div>

  </div>
</body>
</html>
          `,
        });

        console.log('✅ Beide E-Mails versendet');
      } catch (mailError) {
        console.error('❌ Mail-Fehler:', mailError);
      }
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('❌ Fehler bei Order:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await prisma.order.update({
      where: { id },
      data: { status: body.status },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Fehler' }, { status: 500 });
  }
}
