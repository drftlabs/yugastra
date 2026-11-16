/** @type {import('next').NextConfig} */
module.exports = {
  images: { remotePatterns: [{ protocol: 'https', hostname: '**' }] },
  experimental: { serverActions: { bodySizeLimit: '4mb' } },
};
