import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Bestellung in Datenbank speichern (WICHTIG!)
    const order = await prisma.order.create({
      data: {
        customerName: body.name || "Unbekannt",
        customerEmail: body.email || "keine@email.de",
        customerAddress: `${body.address || ''}, ${body.zip || ''} ${body.city || ''}`.trim() || "Keine Adresse",
        subtotal: parseFloat(body.subtotal?.toString() || "0"),
        shippingCost: parseFloat(body.shippingCost?.toString() || "6.20"),
        totalAmount: parseFloat(body.totalAmount?.toString() || "0"),
        paymentMethod: body.paymentMethod || "BANK_TRANSFER",
        itemsJson: body.items ? JSON.stringify(body.items) : "[]",
        status: body.paymentMethod === 'PAYPAL' ? 'PAID' : 'PENDING',
      }
    });

    console.log('✅ Order erstellt mit ID:', order.id);

    // 2. Artikelliste für die E-Mail aufbereiten
    const itemList = body.items && body.items.length > 0 
      ? body.items.map((item: any) => `- ${item.title} (${Number(item.price).toFixed(2)} EUR)`).join('\n')
      : 'Keine Artikel Details';

    // 3. E-Mail Konfiguration
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

        const mailOptions = {
          from: smtpEmail,
          to: 'berndos.shop@gmail.com',
          subject: `Neue Bestellung von ${order.customerName}`,
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

METHODE: ${order.paymentMethod}
Bestell-ID: ${order.id}
          `.trim(),
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ Mail versendet');
      } catch (mailError) {
        console.error('❌ Mail-Fehler:', mailError);
        // Wir werfen hier keinen Fehler, damit die Bestellung trotzdem als Erfolg gilt, 
        // da sie ja bereits in der Datenbank steht.
      }
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('❌ Fehler bei Order-Verarbeitung:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}