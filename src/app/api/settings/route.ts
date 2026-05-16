import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await (prisma as any).setting?.findUnique({
      where: { id: 'global' }
    });
    return NextResponse.json(settings || {
      paypalClientId: '', bankIban: '', bankBic: '', bankHolder: '', bankName: ''
    });
  } catch (error) {
    console.error('Settings GET Fehler:', error);
    return NextResponse.json({
      paypalClientId: '', bankIban: '', bankBic: '', bankHolder: '', bankName: ''
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Settings POST body:', body);
    const settings = await (prisma as any).setting?.upsert({
      where: { id: 'global' },
      update: {
        paypalClientId: body.paypalClientId || '',
        bankIban: body.bankIban || '',
        bankBic: body.bankBic || '',
        bankHolder: body.bankHolder || '',
        bankName: body.bankName || '',
      },
      create: {
        id: 'global',
        paypalClientId: body.paypalClientId || '',
        bankIban: body.bankIban || '',
        bankBic: body.bankBic || '',
        bankHolder: body.bankHolder || '',
        bankName: body.bankName || '',
      }
    });
    console.log('Settings gespeichert:', settings);
    return NextResponse.json(settings || { success: true });
  } catch (error) {
    console.error('Settings POST Fehler:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}