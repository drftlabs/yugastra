/** @type {import('next').NextConfig} */
const PUBLIC_CACHE = 'public, s-maxage=60, stale-while-revalidate=120';
module.exports = {
  async headers() {
    return [{ source: '/((?!admin|api|account|checkout|_next|cart|order).*)', headers: [{ key: 'Cache-Control', value: PUBLIC_CACHE }] }];
  },
  images: { remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }], formats: ['image/webp'], minimumCacheTTL: 31536000 },
  experimental: { serverActions: { bodySizeLimit: '4mb' } },
};
