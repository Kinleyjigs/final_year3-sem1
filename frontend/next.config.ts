import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow cross-origin requests from localhost during development
  devIndicators: {
    buildActivityPosition: 'bottom-right',
  },
  // Ensure environment variables are available
  env: {
    WORKOS_API_KEY: process.env.WORKOS_API_KEY,
    WORKOS_CLIENT_ID: process.env.WORKOS_CLIENT_ID,
    WORKOS_REDIRECT_URI: process.env.WORKOS_REDIRECT_URI,
    WORKOS_COOKIE_PASSWORD: process.env.WORKOS_COOKIE_PASSWORD,
  },
};

export default nextConfig;
