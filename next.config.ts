import type { NextConfig } from 'next';
const config: NextConfig = {
  experimental: {serverActions: {bodySizeLimit: '8mb'}},
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com', pathname: '/photo-*' }],
    qualities: [90],
  },
};
export default config;
