import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yolculukmaliyetim.com"),
  title: "Yolculuk Maliyet Hesaplayıcı",
  description:
    "Araç, mesafe ve güncel yakıt fiyatlarına göre yolculuk maliyetinizi hesaplayın.",
  alternates: {
    canonical: "https://yolculukmaliyetim.com",
  },
  openGraph: {
    title: "Yolculuk Maliyet Hesaplayıcı",
    description:
      "Araç, mesafe ve güncel yakıt fiyatlarına göre yolculuk maliyetinizi hesaplayın.",
    url: "https://yolculukmaliyetim.com",
    siteName: "Yolculuk Maliyet Hesaplayıcı",
    locale: "tr_TR",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Yolculuk Maliyet Hesaplayıcı",
  url: "https://yolculukmaliyetim.com",
  description:
    "Araç, mesafe ve güncel yakıt fiyatlarına göre yolculuk maliyetinizi hesaplayın.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={inter.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
        <footer style={{
          position: "fixed",
          bottom: "12px",
          left: "12px",
          fontSize: "11px",
          color: "rgba(150,150,150,0.7)",
          pointerEvents: "auto",
          zIndex: 50,
        }}>
          Websitesi Deniz Baran tarafından yapılmıştır, tüm hakları saklıdır.{" "}
          <a href="mailto:contact@minimath.dev" style={{ color: "inherit", textDecoration: "underline" }}>
            İletişim: contact@minimath.dev
          </a>
        </footer>
      </body>
    </html>
  );
}
