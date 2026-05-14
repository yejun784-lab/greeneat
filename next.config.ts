import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        // Supabase Storage — 상품 이미지 업로드용
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // GreenEat 공홈 Cafe24 CDN
        protocol: "https",
        hostname: "ecimg.cafe24img.com",
      },
    ],
  },
};

export default nextConfig;
