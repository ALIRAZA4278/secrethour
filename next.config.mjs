/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'secrethour.lovable.app',
      },
    ],
  },
};

export default nextConfig;
