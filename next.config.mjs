/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // No ESLint config/dependency in this project yet
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
