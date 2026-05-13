import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const products = await (prisma as any).product.findMany();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Fehler beim Laden der Produkte' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const product = await prisma.product.create({ 
      data: {
        name: body.name,
        description: body.description,
        price: parseFloat(body.price),
        imageUrl: body.imageUrl,
        isVisible: true
      } 
    });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Fehler beim Erstellen des Produkts' }, { status: 500 });
  }
}
