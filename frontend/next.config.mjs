/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enables the creation of the standalone folder for Docker
  output: 'standalone', 
  images: {
    unoptimized: true,
  },
};

export default nextConfig;