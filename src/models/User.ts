import { Schema, models, model } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: String,
  phone: String,
  
  // Buyer plan (₦200/month)
  buyerPlanActive: { type: Boolean, default: false },
  buyerAirtimeSent: { type: Boolean, default: false },
  buyerPlanActivatedAt: Date,
  
  // Seller plan (₦1,000/month)
  sellerPlan: { type: String, enum: ['free', 'premium'], default: 'free' },
  sellerAirtimeSent: { type: Boolean, default: false },
  sellerPlanActivatedAt: Date,
  
  // Referral system
  referralCode: { type: String, unique: true },
  referredBy: { type: Schema.Types.ObjectId, ref: 'User' },
  referralBonusesPaid: [{ 
    referredUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    paidAt: Date 
  }],
}, { timestamps: true });

const User = models.User || model('User', UserSchema);
export default User;
