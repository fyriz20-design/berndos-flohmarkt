import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Einzelnen Artikel laden
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const article = await (prisma as any).article.findUnique({ where: { id } });
    if (!article) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });
    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json({ error: 'Fehler' }, { status: 500 });
  }
}

// DELETE - Artikel löschen
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await (prisma as any).article.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Fehler beim Löschen:', error);
    return NextResponse.json({ error: 'Fehler beim Löschen' }, { status: 500 });
  }
}
