export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Alle Artikel laden
export async function GET() {
  try {
    const articles = await (prisma as any).article.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json({ error: 'Fehler beim Laden' }, { status: 500 });
  }
}

// POST - Neuen Artikel erstellen
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || body.price === undefined) {
      return NextResponse.json({ error: 'Titel und Preis sind Pflichtfelder' }, { status: 400 });
    }

    let imagesArr: string[] = []
    try {
      imagesArr = Array.isArray(body.imagesJson) ? body.imagesJson : (body.imagesJson ? JSON.parse(body.imagesJson) : (body.imageUrl ? [body.imageUrl] : []))
    } catch(e) { imagesArr = body.imageUrl ? [body.imageUrl] : [] }

    const baseData = {
      title: body.title,
      description: body.description || '',
      price: parseFloat(body.price),
      stock: parseInt(body.stock) || 1,
      imageUrl: imagesArr[0] || body.imageUrl || null,
      isAvailable: true,
    }

    let article
    try {
      article = await (prisma as any).article.create({ data: { ...baseData, imagesJson: JSON.stringify(imagesArr) } });
    } catch(e: any) {
      // Fallback: ohne imagesJson erstellen falls Spalte fehlt
      article = await (prisma as any).article.create({ data: baseData });
    }

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Fehler beim Erstellen:', error);
    return NextResponse.json({ error: 'Fehler beim Erstellen' }, { status: 500 });
  }
}

