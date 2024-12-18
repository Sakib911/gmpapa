import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Store } from '@/lib/models/store.model';
import dbConnect from '@/lib/db/mongodb';

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

    const store = await Store.findOne({ reseller: session.user.id });
    if (!store) {
      return Response.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }

    return Response.json(store);
  } catch (error) {
    console.error('Failed to fetch store settings:', error);
    return Response.json(
      { error: 'Failed to fetch store settings' },
      { status: 500 }
    );
  }
}

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

    const updates = await req.json();

    // Validate required fields
    if (updates.name && updates.name.length < 3) {
      return Response.json(
        { error: 'Store name must be at least 3 characters long' },
        { status: 400 }
      );
    }

    // Update store settings
    const store = await Store.findOneAndUpdate(
      { reseller: session.user.id },
      { $set: updates },
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
    console.error('Failed to update store settings:', error);
    return Response.json(
      { error: 'Failed to update store settings' },
      { status: 500 }
    );
  }
}