/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Enable ES modules in the lib directory
  experimental: {
    esmExternals: true,
  },
  
  // Webpack configuration for proper module resolution
  webpack: (config, { isServer }) => {
    // Handle ES modules properly
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };
    
    return config;
  },
};

module.exports = nextConfig;