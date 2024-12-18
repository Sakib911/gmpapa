import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Order } from '@/lib/models/order.model';
import { User } from '@/lib/models/user.model';
import { verifyRedeemCode } from '@/lib/utils/redeem-code';
import dbConnect from '@/lib/db/mongodb';
import mongoose from 'mongoose';

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

    const { code } = await req.json();
    if (!code) {
      return Response.json(
        { error: 'Code is required' },
        { status: 400 }
      );
    }

    // Start transaction
    const dbSession = await mongoose.startSession();
    await dbSession.startTransaction();

    try {
      // Verify and get order
      const order = await verifyRedeemCode(code);

      // Update user's wallet balance
      const user = await User.findById(session.user.id).session(dbSession);
      if (!user) {
        throw new Error('User not found');
      }

      // Add balance to user's wallet
      user.wallet.balance += order.total;
      user.wallet.transactions.push({
        type: 'credit',
        amount: order.total,
        description: `Redeem code: ${code}`,
        status: 'completed'
      });

      await user.save({ session: dbSession });

      // Mark code as used
      order.redeemStatus = 'used';
      order.redeemedAt = new Date();
      await order.save({ session: dbSession });

      await dbSession.commitTransaction();

      return Response.json({
        success: true,
        amount: order.total,
        balance: user.wallet.balance
      });
    } catch (error) {
      await dbSession.abortTransaction();
      throw error;
    } finally {
      dbSession.endSession();
    }
  } catch (error) {
    console.error('Redeem verification error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to verify code' },
      { status: 500 }
    );
  }
}