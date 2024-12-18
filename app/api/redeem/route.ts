import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { RedeemCode } from '@/lib/models/redeem-code.model';
import { User } from '@/lib/models/user.model';
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
        { error: 'Redeem code is required' },
        { status: 400 }
      );
    }

    // Start transaction
    const dbSession = await mongoose.startSession();
    await dbSession.startTransaction();

    try {
      // Find and validate redeem code
      const redeemCode = await RedeemCode.findOne({
        code: code.toUpperCase(),
        status: 'active',
        expiresAt: { $gt: new Date() }
      }).session(dbSession);

      if (!redeemCode) {
        throw new Error('Invalid or expired redeem code');
      }

      // Update user's wallet balance
      const user = await User.findById(session.user.id).session(dbSession);
      if (!user) {
        throw new Error('User not found');
      }

      user.wallet.balance += redeemCode.amount;
      user.wallet.transactions.push({
        type: 'credit',
        amount: redeemCode.amount,
        description: `Redeem code: ${redeemCode.code}`,
        status: 'completed'
      });

      await user.save({ session: dbSession });

      // Mark code as used
      redeemCode.status = 'used';
      redeemCode.usedBy = user._id;
      redeemCode.usedAt = new Date();
      await redeemCode.save({ session: dbSession });

      await dbSession.commitTransaction();

      return Response.json({
        success: true,
        amount: redeemCode.amount,
        balance: user.wallet.balance
      });
    } catch (error) {
      await dbSession.abortTransaction();
      throw error;
    } finally {
      dbSession.endSession();
    }
  } catch (error) {
    console.error('Redeem error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to redeem code' },
      { status: 500 }
    );
  }
}