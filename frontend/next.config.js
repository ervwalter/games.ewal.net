/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cf.geekdo-images.com',
        port: '',
        pathname: '/images/**',
      },
    ],
    minimumCacheTTL: 60 * 60 * 24, // 24 hours minimum cache for images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Optimize image sizes
    formats: ['image/webp'], // Prefer WebP format for better compression
  },
  typedRoutes: true,
  output: 'standalone',
}

export default nextConfig
