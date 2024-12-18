import mongoose, { Schema, Document } from 'mongoose';

export interface IRedeemCode extends Document {
  code: string;
  amount: number;
  status: 'active' | 'used' | 'expired';
  createdBy: mongoose.Types.ObjectId;
  usedBy?: mongoose.Types.ObjectId;
  usedAt?: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RedeemCodeSchema = new Schema<IRedeemCode>({
  code: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true,
    trim: true
  },
  amount: { 
    type: Number, 
    required: true,
    min: 0
  },
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
  usedAt: Date,
  expiresAt: { 
    type: Date, 
    required: true 
  }
}, {
  timestamps: true
});

// Indexes
RedeemCodeSchema.index({ code: 1 }, { unique: true });
RedeemCodeSchema.index({ status: 1 });
RedeemCodeSchema.index({ expiresAt: 1 });
RedeemCodeSchema.index({ createdBy: 1 });
RedeemCodeSchema.index({ usedBy: 1 });

export const RedeemCode = mongoose.models.RedeemCode || 
  mongoose.model<IRedeemCode>('RedeemCode', RedeemCodeSchema);