import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from '@/context/AuthProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SellAny - Nigerian Marketplace",
  description: "Buy and sell goods & services in Nigeria",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        <div className="text-center py-6 text-xs text-gray-500">
          Need help? 💬 <a href="https://wa.me/2348142750728" className="text-blue-600 underline">Chat us on WhatsApp</a>
        </div>
        </AuthProvider>
      </body>
    </html>
  );
}
