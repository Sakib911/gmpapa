import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Order } from '@/lib/models/order.model';
import { User } from '@/lib/models/user.model';
import dbConnect from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'reseller') {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const timeframe = searchParams.get('timeframe') || 'month';

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    switch (timeframe) {
      case 'day':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case 'year':
        startDate.setDate(startDate.getDate() - 365);
        break;
    }

    // Get revenue data
    const revenueData = await Order.aggregate([
      {
        $match: {
          reseller: new ObjectId(session.user.id),
          status: 'completed',
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
          customers: { $addToSet: '$customer' }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    // Calculate growth rates
    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    const [currentPeriod, previousPeriod] = await Promise.all([
      Order.aggregate([
        {
          $match: {
            reseller: new ObjectId(session.user.id),
            status: 'completed',
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: null,
            revenue: { $sum: '$total' },
            orders: { $sum: 1 },
            customers: { $addToSet: '$customer' }
          }
        }
      ]),
      Order.aggregate([
        {
          $match: {
            reseller: new ObjectId(session.user.id),
            status: 'completed',
            createdAt: { $gte: previousPeriodStart, $lt: startDate }
          }
        },
        {
          $group: {
            _id: null,
            revenue: { $sum: '$total' },
            orders: { $sum: 1 },
            customers: { $addToSet: '$customer' }
          }
        }
      ])
    ]);

    const current = currentPeriod[0] || { revenue: 0, orders: 0, customers: [] };
    const previous = previousPeriod[0] || { revenue: 0, orders: 0, customers: [] };

    const calculateGrowth = (current: number, previous: number) => 
      previous === 0 ? 100 : ((current - previous) / previous) * 100;

    // Get top selling products
    const topProducts = await Order.aggregate([
      {
        $match: {
          reseller: new ObjectId(session.user.id),
          status: 'completed',
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $unwind: '$items'
      },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.product.title' },
          sales: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      {
        $sort: { revenue: -1 }
      },
      {
        $limit: 5
      }
    ]);

    return Response.json({
      revenue: {
        total: current.revenue,
        growth: calculateGrowth(current.revenue, previous.revenue),
        chart: revenueData.map(day => ({
          date: day._id,
          value: day.revenue
        }))
      },
      orders: {
        total: current.orders,
        growth: calculateGrowth(current.orders, previous.orders),
        chart: revenueData.map(day => ({
          date: day._id,
          value: day.orders
        }))
      },
      customers: {
        total: current.customers.length,
        growth: calculateGrowth(current.customers.length, previous.customers.length),
        chart: revenueData.map(day => ({
          date: day._id,
          value: day.customers.length
        }))
      },
      products: {
        topSelling: topProducts.map(product => ({
          id: product._id,
          name: product.name,
          sales: product.sales,
          revenue: product.revenue
        }))
      }
    });
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return Response.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}