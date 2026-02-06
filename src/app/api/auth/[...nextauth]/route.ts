import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import type { AuthOptions } from 'next-auth';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async signIn({ user, account }: { user: any; account: any }) {
      await connectToDB();

      // Check URL for referrer
      const url = typeof window !== 'undefined'
        ? window.location.href
        : account?.url || '';

      const refParam = new URL(url).searchParams.get('ref');

      let referredBy = null;
      if (refParam) {
        const referrer = await User.findOne({ referralCode: refParam });
        if (referrer) {
          referredBy = referrer._id;
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
  session: { strategy: 'jwt' },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
