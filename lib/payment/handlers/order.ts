import { Order } from '@/lib/models/order.model';
import { Cart } from '@/lib/models/cart.model';
import { generateOrderNumber } from '../utils';
import { generateRedeemCode } from '@/lib/utils/redeem-code';

export async function handleOrderPayment(payment: any, transactionId: string, session: any) {
  try {
    // Create order from stored cart data
    const cartData = payment.metadata.cartData;
    const orderNumber = await generateOrderNumber();

    // Generate redeem code if this is a game card purchase
    const isGameCard = cartData.items.some((item: any) => 
      item.product.category === 'GAME_CARD'
    );

    const redeemCode = isGameCard ? await generateRedeemCode() : undefined;

    // Create order
    const order = new Order({
      orderNumber,
      customer: payment.metadata.userId,
      items: cartData.items.map((item: any) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price,
        subProductName: item.subProductName,
        metadata: item.metadata
      })),
      total: cartData.total,
      status: 'processing',
      paymentStatus: 'paid',
      payment: {
        provider: 'bkash',
        transactionId,
        amount: payment.amount,
        currency: payment.currency,
        paymentId: payment.paymentId
      },
      redeemCode,
      redeemStatus: redeemCode ? 'pending' : undefined
    });

    await order.save({ session });

    // Update payment status
    payment.status = 'completed';
    payment.transactionId = transactionId;
    payment.orderId = order._id;
    await payment.save({ session });

    // Clear user's cart
    await Cart.findOneAndDelete(
      { user: payment.metadata.userId },
      { session }
    );

    return order._id;
  } catch (error) {
    console.error('Error handling order payment:', error);
    throw error;
  }
}