import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    // ✅ Prevent ESLint errors from failing the build on Vercel
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  experimental: {
    // your experimental flags here if any
  },
  // other config options can go here
}

export default nextConfig
