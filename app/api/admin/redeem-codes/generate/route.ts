import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { RedeemCode } from '@/lib/models/redeem-code.model';
import { generateRedeemCode } from '@/lib/utils/code-generator';
import dbConnect from '@/lib/db/mongodb';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'admin') {
      return Response.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const { amount, quantity = 1, expiresIn = 30 } = await req.json();

    if (!amount || amount <= 0) {
      return Response.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    if (quantity < 1 || quantity > 100) {
      return Response.json(
        { error: 'Quantity must be between 1 and 100' },
        { status: 400 }
      );
    }

    // Generate codes
    const codes = [];
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresIn);

    for (let i = 0; i < quantity; i++) {
      const code = await generateRedeemCode();
      codes.push({
        code,
        amount,
        createdBy: session.user.id,
        expiresAt,
        status: 'active'
      });
    }

    // Save codes to database
    const savedCodes = await RedeemCode.create(codes);

    return Response.json({
      success: true,
      codes: savedCodes
    });
  } catch (error) {
    console.error('Failed to generate redeem codes:', error);
    return Response.json(
      { error: 'Failed to generate redeem codes' },
      { status: 500 }
    );
  }
}