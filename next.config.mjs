/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  serverExternalPackages: ['nodemailer'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'secrethour.lovable.app',
      },
    ],
  },
  async redirects() {
    return [
      {
        // 301 redirect: non-www to www
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'secrethour.pk',
          },
        ],
        destination: 'https://www.secrethour.pk/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
