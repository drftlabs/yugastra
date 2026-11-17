/** @type {import('next').NextConfig} */
module.exports = {
  images: { remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }], formats: ['image/webp'], minimumCacheTTL: 31536000 },
  experimental: { serverActions: { bodySizeLimit: '4mb' } },
};
