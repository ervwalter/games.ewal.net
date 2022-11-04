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
    appDir: true,
    enableUndici: true,
  },
};

module.exports = nextConfig;
