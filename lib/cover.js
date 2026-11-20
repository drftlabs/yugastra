// Which photo leads. Default products (6-angle sets) lead with the 3rd photo.
// Products with "Front photo first" ticked (KAVACH), or with fewer than 6 photos, lead with the front photo, in stored order.
export const frontFirst = (p) => !!p?.cover_first || (p?.images?.length || 0) < 6;
export const coverImg = (p) => (frontFirst(p) ? p?.images?.[0] : p?.images?.[2]) || p?.images?.[0] || null;
