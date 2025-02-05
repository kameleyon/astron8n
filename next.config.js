/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      swisseph: true,
      'swisseph/build/Release/swisseph.node': true,
      fs: false,
      path: false,
    };
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/test',
        destination: '/app/test',
      },
      {
        source: '/api/:path*',
        destination: '/app/api/:path*',
      }
    ];
  },
  images: { 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  compiler: {
    styledComponents: true,
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;
