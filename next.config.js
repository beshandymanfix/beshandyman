/** @type {import('next').NextConfig} */
const nextConfig = {
  // Forces the creation of the static "out" folder
  output: 'export',
  
  // Required for GitHub Pages
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;