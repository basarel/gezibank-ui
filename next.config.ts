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
  output: 'standalone', // Windows'ta symlink hatası veriyor, kapatıldı
  // Production deployment için gerekirse açılabilir (Linux/Mac'te çalışır)
  experimental: {
    optimizePackageImports: [
      '@mantine/core',
      '@mantine/hooks',
      '@mantine/dates',
    ],
  },
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
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
      {
        protocol: 'https' as const,
        hostname: 'paraflystatic.mncdn.com',
      },
      {
        protocol: 'https' as const,
        hostname: '*.s3.amazonaws.com',
      },
      {
        protocol: 'https' as const,
        hostname: '*.s3.*.amazonaws.com',
      },
      {
        protocol: 'https' as const,
        hostname: '*.supabase.co',
      },
      {
        protocol: 'http' as const,
        hostname: 'localhost',
        port: '3000',
      },
      {
        protocol: 'http' as const,
        hostname: 'localhost',
        port: '3001',
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
        source: '/kampanyalar/:slug',
        destination: '/campaigns/:slug',
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
    ]
  },
}

export default withPayload(nextConfig, {
  devBundleServerPackages: false,
})
