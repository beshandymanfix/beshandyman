import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Tells Next.js to build the static "out" folder
  output: 'export',
  
  // Disables Next.js dynamic image server for GitHub Pages compatibility
  images: {
    unoptimized: true,
  },
};

export default nextConfig;