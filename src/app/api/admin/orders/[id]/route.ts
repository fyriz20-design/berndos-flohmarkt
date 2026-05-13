import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    // Ändere Zeile 7 zu:
const updated = await (prisma as any).product.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Fehler beim Bearbeiten' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Ändere Zeile 21 zu:
await (prisma as any).product.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Produkt gelöscht' });
  } catch (error) {
    return NextResponse.json({ error: 'Fehler beim Löschen' }, { status: 500 });
  }
}
