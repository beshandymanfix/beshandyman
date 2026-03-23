/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed to allow dynamic database routes like /handyman/[id] to work automatically
  // output: 'export',
  output: 'standalone', // enable shrink the size of your app for Docker 
  // Required for GitHub Pages
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;