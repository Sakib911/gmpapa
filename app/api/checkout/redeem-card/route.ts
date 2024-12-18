import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { RedeemCard } from '@/lib/models/redeem-card.model';
import { initializePayment } from '@/lib/payment';
import dbConnect from '@/lib/db/mongodb';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { cardId } = await req.json();
    if (!cardId) {
      return Response.json(
        { error: 'Card ID is required' },
        { status: 400 }
      );
    }

    // Get card
    const card = await RedeemCard.findById(cardId);
    if (!card) {
      return Response.json(
        { error: 'Card not found' },
        { status: 404 }
      );
    }

    if (card.status !== 'active') {
      return Response.json(
        { error: 'Card is not available' },
        { status: 400 }
      );
    }

    // Initialize payment
    const paymentResult = await initializePayment({
      type: 'redeem_card',
      userId: session.user.id,
      amount: card.amount,
      metadata: {
        cardId: card._id,
        description: `Game Card - ${card.amount} BDT`
      }
    });

    return Response.json({
      paymentId: paymentResult.paymentId,
      bkashURL: paymentResult.bkashURL
    });
  } catch (error) {
    console.error('Failed to process card purchase:', error);
    return Response.json(
      { error: 'Failed to process card purchase' },
      { status: 500 }
    );
  }
}