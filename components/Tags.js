// Small tag pills: New, Bestseller, Limited (or any custom tag added in the admin panel).
const CLS = { new: 'new', bestseller: 'best', limited: 'lim' };
export const tagClass = (t) => CLS[String(t).trim().toLowerCase()] || 'oth';
export default function Tags({ tags, t = (x) => x, className = '' }) {
  const list = Array.isArray(tags) ? tags.filter(Boolean) : [];
  if (!list.length) return null;
  return <span className={`tgs ${className}`}>{list.map((x) => <span key={x} className={`tg ${tagClass(x)}`}>{t(x)}</span>)}</span>;
}
