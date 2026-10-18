import type { NextConfig } from 'next';
const config: NextConfig = {
  experimental: {serverActions: {bodySizeLimit: '8mb'}},
  async headers(){return [{source:'/admin/sw.js',headers:[{key:'Cache-Control',value:'no-cache, no-store, must-revalidate'},{key:'Service-Worker-Allowed',value:'/admin/'}]}]},
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com', pathname: '/photo-*' }],
    qualities: [90],
  },
};
export default config;
