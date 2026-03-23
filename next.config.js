/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed to allow dynamic database routes like /handyman/[id] to work automatically
  // output: 'export',
  
  // Required for GitHub Pages
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;