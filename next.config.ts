import type { NextConfig } from 'next';
const config: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com', pathname: '/photo-*' }],
    qualities: [90],
  },
};
export default config;
