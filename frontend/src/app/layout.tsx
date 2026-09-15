import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { BRAND } from "@/config/brand";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${BRAND.name} — ${BRAND.tagline}`,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.description,
  keywords: ["domain names", "web hosting", "cloud infrastructure", "DNS management", "SSL hosting", "developer platform"],
  authors: [{ name: "Nexora Technologies" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://nexora.io",
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description: BRAND.description,
    siteName: BRAND.name,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-background text-foreground font-sans selection:bg-brand-500 selection:text-white antialiased transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
