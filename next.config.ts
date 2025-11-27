import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */ 
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "peru.travel",
        port: "",
      },
    ],
    
  },
};

export default nextConfig;
