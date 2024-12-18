import { PaymentType } from './types';
import { Order } from '@/lib/models/order.model';

export function getRedirectUrl(type: PaymentType, status: string, orderId?: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  
  switch (type) {
    case 'order': {
      switch (status) {
        case 'success':
          return `${baseUrl}/orders/${orderId}/success`;
        case 'failed':
          return `${baseUrl}/orders/failed`;
        case 'cancelled':
          return `${baseUrl}/orders/cancelled`;
        default:
          return `${baseUrl}/orders/error`;
      }
    }

    case 'wallet_topup': {
      switch (status) {
        case 'success':
          return `${baseUrl}/reseller/wallet?status=success`;
        case 'failed':
          return `${baseUrl}/reseller/wallet?status=failed`;
        case 'cancelled':
          return `${baseUrl}/reseller/wallet?status=cancelled`;
        default:
          return `${baseUrl}/reseller/wallet/error`;
      }
    }

    case 'reseller_registration': {
      switch (status) {
        case 'success':
          return `${baseUrl}/auth/reseller/register/success`;
        case 'failed':
          return `${baseUrl}/auth/reseller/register/failed`;
        case 'cancelled':
          return `${baseUrl}/auth/reseller/register/cancelled`;
        default:
          return `${baseUrl}/auth/reseller/register/error`;
      }
    }

    default:
      return `${baseUrl}/error`;
  }
}

export async function generateOrderNumber() {
  const count = await Order.countDocuments();
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const sequence = (count + 1).toString().padStart(4, '0');
  return `ORD${year}${month}${day}${sequence}`;
}