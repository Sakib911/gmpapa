import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { RedeemCode } from '@/lib/models/redeem-code.model';
import dbConnect from '@/lib/db/mongodb';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'admin') {
      return Response.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const [
      totalCodes,
      activeCodes,
      usedCodes,
      expiredCodes,
      totalAmount
    ] = await Promise.all([
      RedeemCode.countDocuments(),
      RedeemCode.countDocuments({ status: 'active' }),
      RedeemCode.countDocuments({ status: 'used' }),
      RedeemCode.countDocuments({ status: 'expired' }),
      RedeemCode.aggregate([
        {
          $match: { status: 'used' }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ])
    ]);

    return Response.json({
      totalCodes,
      activeCodes,
      usedCodes,
      expiredCodes,
      totalAmount: totalAmount[0]?.total || 0
    });
  } catch (error) {
    console.error('Failed to fetch redeem code stats:', error);
    return Response.json(
      { error: 'Failed to fetch redeem code stats' },
      { status: 500 }
    );
  }
}