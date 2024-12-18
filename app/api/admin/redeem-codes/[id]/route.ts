import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { RedeemCode } from '@/lib/models/redeem-code.model';
import dbConnect from '@/lib/db/mongodb';

export async function DELETE(
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

    const code = await RedeemCode.findById(params.id);
    if (!code) {
      return Response.json(
        { error: 'Code not found' },
        { status: 404 }
      );
    }

    if (code.status === 'used') {
      return Response.json(
        { error: 'Cannot delete used code' },
        { status: 400 }
      );
    }

    await code.deleteOne();

    return Response.json({
      success: true,
      message: 'Code deleted successfully'
    });
  } catch (error) {
    console.error('Failed to delete redeem code:', error);
    return Response.json(
      { error: 'Failed to delete redeem code' },
      { status: 500 }
    );
  }
}

export async function PATCH(
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

    const { status } = await req.json();
    if (!['active', 'expired'].includes(status)) {
      return Response.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const code = await RedeemCode.findById(params.id);
    if (!code) {
      return Response.json(
        { error: 'Code not found' },
        { status: 404 }
      );
    }

    if (code.status === 'used') {
      return Response.json(
        { error: 'Cannot modify used code' },
        { status: 400 }
      );
    }

    code.status = status;
    await code.save();

    return Response.json(code);
  } catch (error) {
    console.error('Failed to update redeem code:', error);
    return Response.json(
      { error: 'Failed to update redeem code' },
      { status: 500 }
    );
  }
}