import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { RedeemCard } from '@/lib/models/redeem-card.model';
import dbConnect from '@/lib/db/mongodb';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const amount = searchParams.get('amount');

    const query: any = { status: 'active' };
    if (amount) {
      query.amount = parseInt(amount);
    }

    const cards = await RedeemCard.find(query)
      .sort({ amount: 1 })
      .limit(50);

    return Response.json(cards);
  } catch (error) {
    console.error('Failed to fetch redeem cards:', error);
    return Response.json(
      { error: 'Failed to fetch redeem cards' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'admin') {
      return Response.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const { amount, description } = await req.json();
    if (!amount || amount <= 0) {
      return Response.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    const card = await RedeemCard.create({
      amount,
      description,
      createdBy: session.user.id,
      status: 'active'
    });

    return Response.json(card);
  } catch (error) {
    console.error('Failed to create redeem card:', error);
    return Response.json(
      { error: 'Failed to create redeem card' },
      { status: 500 }
    );
  }
}