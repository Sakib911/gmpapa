import mongoose, { Schema, Document } from 'mongoose';

export interface IRedeemCard extends Document {
  amount: number;
  description?: string;
  status: 'active' | 'used' | 'expired';
  createdBy: mongoose.Types.ObjectId;
  usedBy?: mongoose.Types.ObjectId;
  usedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RedeemCardSchema = new Schema<IRedeemCard>({
  amount: { 
    type: Number, 
    required: true,
    min: 0
  },
  description: String,
  status: { 
    type: String, 
    enum: ['active', 'used', 'expired'],
    default: 'active'
  },
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  usedBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  },
  usedAt: Date
}, {
  timestamps: true
});

// Indexes
RedeemCardSchema.index({ status: 1 });
RedeemCardSchema.index({ amount: 1 });
RedeemCardSchema.index({ createdBy: 1 });
RedeemCardSchema.index({ usedBy: 1 });

export const RedeemCard = mongoose.models.RedeemCard || 
  mongoose.model<IRedeemCard>('RedeemCard', RedeemCardSchema);