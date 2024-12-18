import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Order } from '@/lib/models/order.model';
import dbConnect from '@/lib/db/mongodb';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's redeem codes from orders
    const orders = await Order.find({
      customer: session.user.id,
      redeemCode: { $exists: true }
    })
    .sort({ createdAt: -1 })
    .select('redeemCode redeemStatus total createdAt redeemedAt');

    // Format codes for response
    const codes = orders.map(order => ({
      _id: order._id,
      code: order.redeemCode,
      amount: order.total,
      status: order.redeemStatus,
      createdAt: order.createdAt,
      redeemedAt: order.redeemedAt
    }));

    return Response.json(codes);
  } catch (error) {
    console.error('Failed to fetch redeem codes:', error);
    return Response.json(
      { error: 'Failed to fetch redeem codes' },
      { status: 500 }
    );
  }
}