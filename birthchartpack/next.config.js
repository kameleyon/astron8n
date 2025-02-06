/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co'
      }
    ],
    unoptimized: true
  },
  output: 'standalone',
  poweredByHeader: false,
  compress: true,

  experimental: {
    // Ensure SWC is used for compilation
    forceSwcTransforms: true,
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

    // Handle native modules
    if (isServer) {
      config.externals = [...config.externals, 'swisseph', 'swisseph-v2', 'tz-lookup'];
    } else {
      config.resolve.alias = {
        ...config.resolve.alias,
        'swisseph': require.resolve('swisseph'),
        'swisseph-v2': require.resolve('swisseph-v2'),
        'tz-lookup': require.resolve('tz-lookup')
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

    return config;
  },

  transpilePackages: ['moment-timezone']
};

module.exports = nextConfig;
