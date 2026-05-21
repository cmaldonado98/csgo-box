import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.10.157"],
  async rewrites() {
    return [
      {
        source: "/api/skins",
        destination: "https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins.json",
      },
    ];
  },
};

export default nextConfig;
