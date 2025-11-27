import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */ 
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.peru.travel",
        port: "",
      },
    ],
    
  },
};

export default nextConfig;
