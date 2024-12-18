import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Store } from '@/lib/models/store.model';
import dbConnect from '@/lib/db/mongodb';

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'reseller') {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { templates, activeTemplate } = await req.json();

    // Update store layout settings
    const store = await Store.findOneAndUpdate(
      { reseller: session.user.id },
      {
        $set: {
          'layout.templates': templates,
          'layout.activeTemplate': activeTemplate
        }
      },
      { new: true }
    );

    if (!store) {
      return Response.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }

    return Response.json(store);
  } catch (error) {
    console.error('Failed to update store layout:', error);
    return Response.json(
      { error: 'Failed to update store layout' },
      { status: 500 }
    );
  }
}