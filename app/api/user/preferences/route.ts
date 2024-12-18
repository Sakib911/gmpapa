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

    const data = await req.json();
    const user = await User.findById(session.user.id);

    if (!user) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update preferences
    user.preferences = {
      ...user.preferences,
      ...data
    };

    await user.save();

    return Response.json({
      success: true,
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Failed to update preferences:', error);
    return Response.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}