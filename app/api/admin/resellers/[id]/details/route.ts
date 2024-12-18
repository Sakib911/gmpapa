import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { User } from '@/lib/models/user.model';
import { Store } from '@/lib/models/store.model';
import { Order } from '@/lib/models/order.model';
import dbConnect from '@/lib/db/mongodb';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'admin') {
      return Response.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // Get reseller details
    const [reseller, store, orders] = await Promise.all([
      User.findById(params.id).select('-password'),
      Store.findOne({ reseller: params.id }),
      Order.find({ reseller: params.id })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('customer', 'name email')
    ]);

    if (!reseller) {
      return Response.json(
        { error: 'Reseller not found' },
        { status: 404 }
      );
    }

    // Calculate statistics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return Response.json({
      reseller,
      store,
      recentOrders: orders,
      statistics: {
        totalOrders,
        totalRevenue,
        averageOrderValue
      }
    });
  } catch (error) {
    console.error('Failed to fetch reseller details:', error);
    return Response.json(
      { error: 'Failed to fetch reseller details' },
      { status: 500 }
    );
  }
}