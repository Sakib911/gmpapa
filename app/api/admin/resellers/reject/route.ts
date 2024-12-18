import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { User } from '@/lib/models/user.model';
import { Store } from '@/lib/models/store.model';
import { sendNotification } from '@/lib/send-notification';
import dbConnect from '@/lib/db/mongodb';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const authSession = await getServerSession(authOptions);
    if (!authSession?.user?.id || authSession.user.role !== 'admin') {
      return Response.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const { reason } = await req.json();

    const reseller = await User.findById(params.id);
    if (!reseller) {
      return Response.json(
        { error: 'Reseller not found' },
        { status: 404 }
      );
    }

    if (reseller.role !== 'reseller') {
      return Response.json(
        { error: 'User is not a reseller' },
        { status: 400 }
      );
    }

    // Start transaction
    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();

    try {
      // Update reseller status
      reseller.status = 'rejected';
      await reseller.save({ session: dbSession });

      // Update store status
      await Store.findOneAndUpdate(
        { reseller: reseller._id },
        { $set: { status: 'rejected' } },
        { session: dbSession }
      );

      // Send notification to reseller
      await sendNotification({
        userId: reseller._id.toString(),
        title: 'Application Rejected',
        message: reason || 'Your reseller application has been rejected.',
        type: 'system',
        metadata: {
          type: 'reseller_rejection',
          rejectedBy: authSession.user.id,
          reason
        }
      });

      await dbSession.commitTransaction();

      return Response.json({
        message: 'Reseller application rejected',
        reseller: {
          id: reseller._id,
          name: reseller.name,
          email: reseller.email,
          status: reseller.status
        }
      });
    } catch (error) {
      await dbSession.abortTransaction();
      throw error;
    } finally {
      dbSession.endSession();
    }
  } catch (error) {
    console.error('Failed to reject reseller:', error);
    return Response.json(
      { error: 'Failed to reject reseller' },
      { status: 500 }
    );
  }
}