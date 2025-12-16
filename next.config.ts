import { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

const NEXT_PUBLIC_SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000')

const nextConfig: NextConfig = {
  typedRoutes: true,
  // output: 'standalone', // Commented out for Windows build compatibility
  // Uncomment for production deployment if needed
  experimental: {
    optimizePackageImports: [
      '@mantine/core',
      '@mantine/hooks',
      '@mantine/dates',
    ],
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Mevcut remote pattern'ler
      {
        protocol: 'https' as const,
        hostname: 'fulltripstatic.mncdn.com',
      },
      {
        protocol: 'https' as const,
        hostname: 'ykmturizm.mncdn.com',
      },
      {
        protocol: 'https' as const,
        hostname: 'imgkit.otelz.com',
      },
      {
        protocol: 'https' as const,
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https' as const,
        hostname: 'gezibank.sm.mncdn.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/otel-listesi/:slug',
        destination: '/hotel/list/:slug',
      },
      {
        source: '/otel-arama/:path',
        destination: '/hotel/search-results',
      },
      {
        source: '/kampanyalar',
        destination: '/campaigns',
      },
      {
        source: '/kampanyalar/:slug/:target',
        destination: '/campaigns/detail',
      },
      {
        source: '/ucak-bileti',
        destination: '/landings/flight',
      },
      {
        source: '/ucak-bileti/:slug',
        destination: '/landings/flight/:slug',
      },
      {
        source: '/otel',
        destination: '/landings/hotel',
      },
      {
        source: '/arac',
        destination: '/landings/car',
      },
      {
        source: '/otobus',
        destination: '/landings/bus',
      },
      {
        source: '/transfer',
        destination: '/landings/transfer',
      },
      {
        source: '/tur',
        destination: '/landings/tour',
      },
      {
        source: '/resmi-tatil-gunleri',
        destination: '/landings/holidays',
      },
      {
        source: '/iletisim',
        destination: '/contact-us',
      },
      {
        source: '/yardim/:slug',
        destination: '/help-center/:slug',
      },
      {
        source: '/online-islemler-seyahatinizi-goruntuleyin',
        destination: '/online-operations',
      },
      {
        source: '/confirm-email',
        destination: '/auth/confirm-email',
      },
      {
        source: '/sifre-yenileme',
        destination: '/auth/password-renew',
      },
      {
        source: '/:slug',
        destination: '/contents/:slug',
        has: [
          {
            type: 'header',
            key: 'x-pathname',
            value: '(?!.*admin).*',
          },
        ],
      },
    ]
  },
}

export default withPayload(nextConfig, {
  devBundleServerPackages: false,
})
