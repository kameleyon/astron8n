/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Temporarily removing standalone output to fix build issues
  // output: 'standalone',
  poweredByHeader: false,
  compress: true,
  experimental: {
    forceSwcTransforms: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
    ],
    // Merged from birthchartpack config
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Handle polyfills and fallbacks
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      net: false,
      dns: false,
      tls: false,
      'supports-color': false
    };

    // Add support for Web Workers
    config.module.rules.push({
      test: /\.worker\.js$/,
      use: { loader: 'worker-loader' }
    });

    // Add support for workerize-loader
    config.module.rules.push({
      test: /\.workerize\.js$/,
      use: { loader: 'workerize-loader' }
    });

    // Handle native modules
    if (isServer) {
      config.externals = [...(config.externals || []), 'swisseph', 'swisseph-v2', 'tz-lookup'];
    } else {
      config.resolve.alias = {
        ...config.resolve.alias,
        'swisseph': false,
        'swisseph-v2': false,
        'tz-lookup': false
      };
    }

    // Configure native module loading
    config.module.rules.push({
      test: /\.(node|swisseph)$/,
      use: [
        {
          loader: 'node-loader',
          options: {
            name: '[name].[ext]'
          }
        }
      ]
    });

    // Handle pdf-lib module
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'pdf-lib': 'pdf-lib/dist/pdf-lib.min.js'
      };
    }

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
  async headers() {
    return [
      {
        // For Stripe webhook - needs raw body for signature verification
        source: '/api/webhook',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
      },
    ];
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
  transpilePackages: ['moment-timezone', 'birthchartpack', 'pdf-lib'],
};

module.exports = nextConfig;
