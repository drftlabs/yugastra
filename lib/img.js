// Serve watch photos through Vercel's image optimiser (resized, modern format) instead of the 2 MB originals.
// The original files stay untouched in storage. Allowed widths must be Next's defaults.
export const opt = (url, w = 640, q = 82) =>
  url && /\.public\.blob\.vercel-storage\.com\//.test(url) ? `/_next/image?url=${encodeURIComponent(url)}&w=${w}&q=${q}` : url;
export const srcSet = (url, w, q = 82) => (url && /\.public\.blob\.vercel-storage\.com\//.test(url) ? `${opt(url, w, q)} 1x, ${opt(url, w * 2 > 1080 ? 1080 : w * 2, q)} 2x` : undefined);
