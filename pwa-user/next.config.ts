const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  eslint: {
    ignoreDuringBuilds: true,
  }
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // config lainnya kalau ada
};

module.exports = withPWA(nextConfig);