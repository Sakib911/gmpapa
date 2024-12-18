import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { User } from '@/lib/models/user.model';
import dbConnect from '@/lib/db/mongodb';

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const settings = await req.json();
    const user = await User.findById(session.user.id);

    if (!user) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update notification settings
    user.preferences.notifications = {
      ...user.preferences.notifications,
      ...settings
    };

    await user.save();

    return Response.json({
      success: true,
      notifications: user.preferences.notifications
    });
  } catch (error) {
    console.error('Failed to update notification settings:', error);
    return Response.json(
      { error: 'Failed to update notification settings' },
      { status: 500 }
    );
  }
}