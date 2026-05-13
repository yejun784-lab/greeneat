import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/components/providers/CartProvider";
import { PWAProvider } from "@/components/providers/PWAProvider";
import { ToastContainer } from "@/components/ui/Toast";
import { ChatBot } from "@/components/mascot/ChatBot";
import { CompareTray } from "@/components/products/CompareTray";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { OnboardingTour } from "@/components/onboarding/OnboardingTour";
import { CartAbandonmentGuard } from "@/components/cart/CartAbandonmentGuard";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GreenEat — 건강한 밀키트 구독 서비스",
  description: "신선하고 건강한 밀키트로 매일의 식사를 특별하게. GreenEat 구독으로 편리하게 즐기세요.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GreenEat",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/icons/apple-touch-icon.png",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#2d7a4f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-surface text-ink">
        <ThemeProvider>
          <PWAProvider />
          <CartProvider>{children}</CartProvider>
          <ToastContainer />
          <CompareTray />
          <ChatBot />
          <OnboardingTour />
          <CartAbandonmentGuard />
        </ThemeProvider>
      </body>
    </html>
  );
}
