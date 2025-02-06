/** @type {import('next').NextConfig} */
const nextConfig = {
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
      config.externals = [...config.externals, 'swisseph', 'swisseph-v2'];
    } else {
      config.resolve.alias = {
        ...config.resolve.alias,
        'swisseph': require.resolve('swisseph'),
        'swisseph-v2': require.resolve('swisseph-v2')
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
  async rewrites() {
    return [
      {
        source: '/test',
        destination: '/app/test',
      },
      {
        source: '/birthchartpack/api/:path*',
        destination: '/app/birthchartpack/app/api/:path*',
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
