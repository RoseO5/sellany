import { Schema, models, model } from 'mongoose';

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: String,
    phone: String,

    // ✅ Seller Premium Plan (₦300/month)
    isPremium: { type: Boolean, default: false },
    premiumSince: Date,
    premiumExpiresAt: Date,

    // ✅ Referral System
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: Schema.Types.ObjectId, ref: 'User' },
    successfulReferrals: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const User = models.User || model('User', UserSchema);
export default User;
