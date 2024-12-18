import { RedeemCard } from '@/lib/models/redeem-card.model';
import { User } from '@/lib/models/user.model';
import { generateRedeemCode } from '@/lib/utils/code-generator';
import { sendNotification } from '@/lib/send-notification';

export async function handleRedeemCardPayment(payment: any, transactionId: string, session: any) {
  try {
    // Get card details
    const card = await RedeemCard.findById(payment.metadata.cardId)
      .session(session);

    if (!card) {
      throw new Error('Card not found');
    }

    if (card.status !== 'active') {
      throw new Error('Card is not available');
    }

    // Generate unique redeem code
    const rede emCode = await generateRedeemCode();

    // Update card status and assign to user
    card.status = 'used';
    card.usedBy = payment.metadata.userId;
    card.usedAt = new Date();
    await card.save({ session });

    // Update payment status
    payment.status = 'completed';
    payment.transactionId = transactionId;
    await payment.save({ session });

    // Send notification to user
    await sendNotification({
      userId: payment.metadata.userId,
      title: 'Game Card Purchase Successful',
      message: `Your ${formatCurrency(card.amount, 'BDT')} game card is ready to use. Redeem code: ${redeemCode}`,
      type: 'system',
      metadata: {
        cardId: card._id,
        amount: card.amount,
        redeemCode
      }
    });

    return card._id;
  } catch (error) {
    console.error('Error handling redeem card payment:', error);
    throw error;
  }
}