import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Yolculuk Maliyet Hesaplayıcı",
  description:
    "Aracınız, güzergahınız ve güncel yakıt fiyatlarına göre yolculuk maliyetinizi hesaplayın.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={inter.variable}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
