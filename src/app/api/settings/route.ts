import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const settings = await prisma.setting.findUnique({
      where: { id: 'global' }
    });
    
    // If no settings exist yet, return empty defaults
    if (!settings) {
      return NextResponse.json({
        paypalClientId: '',
        bankIban: '',
        bankBic: '',
        bankHolder: '',
        bankName: ''
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Admin check
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.get('admin-auth')?.value === 'true';

    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const settings = await prisma.setting.upsert({
      where: { id: 'global' },
      update: {
        paypalClientId: body.paypalClientId,
        bankIban: body.bankIban,
        bankBic: body.bankBic,
        bankHolder: body.bankHolder,
        bankName: body.bankName,
      },
      create: {
        id: 'global',
        paypalClientId: body.paypalClientId,
        bankIban: body.bankIban,
        bankBic: body.bankBic,
        bankHolder: body.bankHolder,
        bankName: body.bankName,
      }
    });

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
