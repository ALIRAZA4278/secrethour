/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  serverExternalPackages: ['nodemailer'],
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'secrethour.lovable.app',
      },
      {
        protocol: 'https',
        hostname: 'bazyygvvewedhnyxetrx.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/product/the-midnight-deck',
        destination: '/product/midnight-deck',
        permanent: true,
      },
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
