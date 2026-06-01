import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/components/providers/CartProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ToastContainer } from "@/components/ui/Toast";
import "./globals.css";

// 초기 번들에서 제외 — 코드 스플리팅으로 lazy 로드
const PWAProvider          = dynamic(() => import("@/components/providers/PWAProvider").then(m => ({ default: m.PWAProvider })));
const ChatBot              = dynamic(() => import("@/components/mascot/ChatBot").then(m => ({ default: m.ChatBot })));
const CompareTray          = dynamic(() => import("@/components/products/CompareTray").then(m => ({ default: m.CompareTray })));
const HealthQuestionnaire  = dynamic(() => import("@/components/onboarding/HealthQuestionnaire").then(m => ({ default: m.HealthQuestionnaire })));
const CartAbandonmentGuard = dynamic(() => import("@/components/cart/CartAbandonmentGuard").then(m => ({ default: m.CartAbandonmentGuard })));

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Vercel 자동 도메인 대응 — NEXT_PUBLIC_SITE_URL > VERCEL_URL > localhost
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

export const metadata: Metadata = {
  title: {
    default: "GreenEat — 진정성 있는 건강한 도시락",
    template: "%s | GreenEat",
  },
  description: "진정성 있는 건강한 선택, 맛있는 도시락. GreenEat 정기구독으로 매일 건강한 한 끼를 편리하게 즐겨보세요.",
  metadataBase: new URL(SITE_URL),
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    siteName: "GreenEat",
    title: "GreenEat — 진정성 있는 건강한 도시락",
    description: "직접 만든 정직한 재료로 완성한 냉동 도시락 정기구독 서비스",
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512, alt: "GreenEat" }],
  },
  twitter: {
    card: "summary",
    title: "GreenEat",
    description: "직접 만든 정직한 재료로 완성한 냉동 도시락 정기구독 서비스",
    images: ["/icons/icon-512.png"],
  },
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
  viewportFit: "cover",
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
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col bg-surface text-ink">
        {/* dev: SW + 캐시 정리 — body 안에서만 Script 렌더 가능 */}
        {process.env.NODE_ENV !== 'production' && (
          <Script id="dev-sw-cleanup" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `
            if('serviceWorker' in navigator){
              navigator.serviceWorker.getRegistrations().then(function(regs){
                regs.forEach(function(r){ r.unregister(); });
              });
              if(typeof caches !== 'undefined'){
                caches.keys().then(function(keys){
                  keys.forEach(function(k){ caches.delete(k); });
                });
              }
            }
          `}} />
        )}
        <ThemeProvider>
          <PWAProvider />
          <CartProvider>{children}</CartProvider>
          <ToastContainer />
          <CompareTray />
          <ChatBot />
          <HealthQuestionnaire />
          <CartAbandonmentGuard />
        </ThemeProvider>
      </body>
    </html>
  );
}
