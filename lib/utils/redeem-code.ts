import cryptoRandomString from 'crypto-random-string';
import { Order } from '@/lib/models/order.model';

export async function generateRedeemCode(): Promise<string> {
  let code: string;
  let isUnique = false;

  while (!isUnique) {
    // Generate a random code with specific pattern
    const prefix = 'GMP'; // Game Market Place
    const randomPart = cryptoRandomString({
      length: 8,
      type: 'alphanumeric',
      uppercase: true
    });

    code = `${prefix}-${randomPart}`;

    // Check if code is unique
    const existingOrder = await Order.findOne({ redeemCode: code });
    if (!existingOrder) {
      isUnique = true;
    }
  }

  return code;
}

export async function verifyRedeemCode(code: string) {
  const order = await Order.findOne({ 
    redeemCode: code,
    redeemStatus: 'pending'
  });

  if (!order) {
    throw new Error('Invalid or expired redeem code');
  }

  return order;
}