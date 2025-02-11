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
  experimental: {
    typedRoutes: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
  output: 'standalone',
  // Add headers for static assets and server actions
  async headers() {
    return [
      {
        // Match static assets
        source: '/:all*(jpg|jpeg|png|svg|webp|js|css|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Match static chunks from Next.js
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Match server action requests
        source: '/_next/data/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=300, stale-if-error=86400',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'max-age=60',
          },
        ],
      },
    ]
  },
}

export default nextConfig
