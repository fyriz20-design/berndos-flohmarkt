export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

export async function GET() {
  try {
    const settings = await db.setting.findUnique({
      where: { id: 'global' }
    });
    return NextResponse.json(settings || {
      id: 'global',
      paypalClientId: '',
      bankIban: '',
      bankBic: '',
      bankHolder: '',
      bankName: ''
    });
  } catch (error) {
    console.error('Settings GET:', error);
    return NextResponse.json({
      id: 'global',
      paypalClientId: '',
      bankIban: '',
      bankBic: '',
      bankHolder: '',
      bankName: ''
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const settings = await db.setting.upsert({
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
    console.error('Settings POST Fehler:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
