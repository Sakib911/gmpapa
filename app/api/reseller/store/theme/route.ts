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

    const { colors } = await req.json();

    // Validate color formats
    const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    for (const [key, value] of Object.entries(colors)) {
      if (!colorRegex.test(value as string)) {
        return Response.json(
          { error: `Invalid color format for ${key}` },
          { status: 400 }
        );
      }
    }

    // Update store theme
    const store = await Store.findOneAndUpdate(
      { reseller: session.user.id },
      {
        $set: {
          theme: {
            primaryColor: colors.primary,
            secondaryColor: colors.secondary,
            accentColor: colors.accent,
            backgroundColor: colors.background,
            textColor: colors.text,
            mutedColor: colors.muted
          }
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
    console.error('Failed to update store theme:', error);
    return Response.json(
      { error: 'Failed to update store theme' },
      { status: 500 }
    );
  }
}