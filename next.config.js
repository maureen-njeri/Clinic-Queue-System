/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  // Remove experimental.appDir — it's now default behavior
}

module.exports = nextConfig
