import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
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

    const { amount } = await req.json();
    if (!amount || amount <= 0) {
      return Response.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Initialize payment
    const paymentResult = await initializePayment({
      type: 'redeem_code',
      userId: session.user.id,
      amount,
      metadata: {
        description: `Redeem Code - ${amount} BDT`
      }
    });

    return Response.json({
      paymentId: paymentResult.paymentId,
      bkashURL: paymentResult.bkashURL
    });
  } catch (error) {
    console.error('Failed to process redeem code purchase:', error);
    return Response.json(
      { error: 'Failed to process purchase' },
      { status: 500 }
    );
  }
}