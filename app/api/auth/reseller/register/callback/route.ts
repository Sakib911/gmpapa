import { NextRequest } from 'next/server';
import { handlePaymentCallback } from '@/lib/payment/callback';
import dbConnect from '@/lib/db/mongodb';
import { apiConfig } from '../../../../route-config';
export const { dynamic, fetchCache, revalidate } = apiConfig;

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const paymentID = searchParams.get('paymentID');
    const status = searchParams.get('status');

    if (!paymentID || !status) {
      return Response.redirect(new URL(`${process.env.NEXT_PUBLIC_APP_URL}/auth/reseller/register/error`));
    }

    const result = await handlePaymentCallback(paymentID, status as any);
    return Response.redirect(new URL(result.redirectUrl));
  } catch (error) {
    console.error('bKash callback error:', error);
    return Response.redirect(new URL(`${process.env.NEXT_PUBLIC_APP_URL}/auth/reseller/register/error`));
  }
}