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
    esmExternals: 'loose',
  }
};

module.exports = nextConfig;
