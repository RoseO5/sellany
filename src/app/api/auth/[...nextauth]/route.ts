import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';

export const authOptions = {
  // 🔑 CRITICAL FOR VERCEL
  trustHost: true,
  useSecureCookies: process.env.NODE_ENV === 'production',
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      // Safely attach user ID from token
      if (token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async signIn({ user, account }: { user: any; account: any }) {
      await connectToDB();

      // Get referrer code from the callback URL
      let referredBy = null;
      if (account?.url) {
        try {
          const url = new URL(account.url);
          const refParam = url.searchParams.get('ref');
          if (refParam) {
            const referrer = await User.findOne({ referralCode: refParam });
            if (referrer) {
              referredBy = referrer._id;
            }
          }
        } catch (e) {
          console.log('Referral parsing error:', e);
        }
      }

      // Generate referral code
      const referralCode = 'SELLANY' + Math.random().toString(36).substring(2, 8).toUpperCase();

      // Create or update user
      await User.findOneAndUpdate(
        { email: user.email },
        {
          email: user.email,
          name: user.name,
          image: user.image,
          referralCode,
          referredBy,
        },
        { upsert: true, new: true }
      );

      return true;
    },
  },
  session: { strategy: 'jwt' as const },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
