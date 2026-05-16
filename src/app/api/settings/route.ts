import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.setting.findUnique({
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
    const settings = await prisma.setting.upsert({
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
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Settings Fehler:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}