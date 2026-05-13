import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// Wir exportieren eine Funktion namens DELETE. 
// Das ist die "Sprache", die wir für Löschvorgänge im Web nutzen.
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> } 
) {
  try {
    // Hier warten wir auf die ID aus der URL
    const { id } = await context.params; 
    const orderId = id;

    // Prisma löscht die Bestellung mit dieser ID
    await prisma.order.delete({
      where: {
        id: orderId
      },
    });

    return NextResponse.json({ message: 'Bestellung erfolgreich gelöscht' }, { status: 200 });

  } catch (error) {
    console.error("Löschfehler:", error);
    return NextResponse.json({ error: 'Fehler beim Löschen der Bestellung' }, { status: 500 });
  }
}