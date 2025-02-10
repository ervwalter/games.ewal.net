/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/overview",
        permanent: false,
      },
    ];
  },
  experimental: {
    turbo: {
      rules: {
        "*.tsx": ["use client"],
      }
    },
    optimizePackageImports: [
      '@headlessui/react',
      '@mantine/hooks',
      'react-icons',
      'lodash-es'
    ]
  }
}

module.exports = nextConfig;
