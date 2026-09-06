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
    // AVIF first (~20% smaller than WebP), WebP as the fallback for browsers without it.
    formats: ['image/avif', 'image/webp'],
    // Optimised variants are re-derived every 4h by default; these source images
    // change rarely, so hold them for 30 days instead.
    minimumCacheTTL: 2592000,
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
  async headers() {
    return [
      {
        // /public/assets filenames are content-hashed (sh-card-game-Cw972EQC.png),
        // so a changed file always gets a new URL — safe to mark immutable.
        source: '/assets/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Banners are NOT hashed and do get swapped for campaigns — cache them a
        // month but leave off `immutable` so a replacement can still take effect.
        source: '/Banners/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' },
        ],
      },
      {
        source: '/:path*.(png|jpg|jpeg|gif|webp|avif|svg|ico|woff|woff2)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' },
        ],
      },
    ];
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
