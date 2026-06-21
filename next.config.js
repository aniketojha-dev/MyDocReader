/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
      os: false,
      stream: false,
      constants: false,
    };
    return config;
  },
};

module.exports = nextConfig;
