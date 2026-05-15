import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const article = await (prisma as any).article.findUnique({ where: { id } });
    if (!article) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });
    return NextResponse.json(article);
  } catch {
    return NextResponse.json({ error: 'Fehler' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const article = await (prisma as any).article.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description || '',
        price: parseFloat(body.price),
        stock: parseInt(body.stock),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
      }
    });
    return NextResponse.json(article);
  } catch (error) {
    console.error('Fehler beim Aktualisieren:', error);
    return NextResponse.json({ error: 'Fehler beim Aktualisieren' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await (prisma as any).article.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Fehler beim Löschen:', error);
    return NextResponse.json({ error: 'Fehler beim Löschen' }, { status: 500 });
  }
}
