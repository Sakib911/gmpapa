import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { RedeemCard } from '@/lib/models/redeem-card.model';
import dbConnect from '@/lib/db/mongodb';

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

    // Create redeem card
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