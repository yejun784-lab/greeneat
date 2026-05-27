import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/components/providers/CartProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ToastContainer } from "@/components/ui/Toast";
import "./globals.css";

// 초기 번들에서 제외 — 페이지 로드 후 lazy 로드
const PWAProvider         = dynamic(() => import("@/components/providers/PWAProvider").then(m => ({ default: m.PWAProvider })), { ssr: false });
const ChatBot             = dynamic(() => import("@/components/mascot/ChatBot").then(m => ({ default: m.ChatBot })), { ssr: false });
const CompareTray         = dynamic(() => import("@/components/products/CompareTray").then(m => ({ default: m.CompareTray })), { ssr: false });
const HealthQuestionnaire = dynamic(() => import("@/components/onboarding/HealthQuestionnaire").then(m => ({ default: m.HealthQuestionnaire })), { ssr: false });
const CartAbandonmentGuard = dynamic(() => import("@/components/cart/CartAbandonmentGuard").then(m => ({ default: m.CartAbandonmentGuard })), { ssr: false });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GreenEat — 진정성 있는 건강한 도시락",
  description: "진정성 있는 건강한 선택, 맛있는 도시락. GreenEat 정기구독으로 매일 건강한 한 끼를 편리하게 즐겨보세요.",
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
      {/* dev 환경: SW + 캐시 즉시 정리 (React 로드 전 실행 → 구 SW가 구 HTML 서빙해도 동작) */}
      {process.env.NODE_ENV !== 'production' && (
        <head>
          <script dangerouslySetInnerHTML={{ __html: `
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
        </head>
      )}
      <body className="min-h-full flex flex-col bg-surface text-ink">
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
