import { Order } from '@/lib/models/order.model';
import { generateRedeemCode } from '@/lib/utils/redeem-code';
import { sendNotification } from '@/lib/send-notification';

export async function handleRedeemCodePayment(payment: any, transactionId: string, session: any) {
  try {
    // Generate unique redeem code
    const redeemCode = await generateRedeemCode();

    // Create order with redeem code
    const order = new Order({
      orderNumber: `RC${Date.now()}`,
      customer: payment.metadata.userId,
      items: [{
        product: null, // No physical product
        quantity: 1,
        price: payment.amount,
        subProductName: `${payment.amount} BDT Redeem Code`,
        metadata: {
          type: 'redeem_code'
        }
      }],
      total: payment.amount,
      status: 'completed',
      paymentStatus: 'paid',
      payment: {
        provider: 'bkash',
        transactionId,
        amount: payment.amount,
        currency: payment.currency,
        paymentId: payment.paymentId
      },
      redeemCode,
      redeemStatus: 'pending'
    });

    await order.save({ session });

    // Update payment status
    payment.status = 'completed';
    payment.transactionId = transactionId;
    payment.orderId = order._id;
    await payment.save({ session });

    // Send notification to user
    await sendNotification({
      userId: payment.metadata.userId,
      title: 'Redeem Code Purchase Successful',
      message: `Your ${payment.amount} BDT redeem code is ready to use. Code: ${redeemCode}`,
      type: 'system',
      metadata: {
        orderId: order._id,
        amount: payment.amount,
        redeemCode
      }
    });

    return order._id;
  } catch (error) {
    console.error('Error handling redeem code payment:', error);
    throw error;
  }
}