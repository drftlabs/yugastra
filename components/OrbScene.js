// The glowing circles were retired. This keeps a quiet, flat backdrop so existing pages need no change.
export default function OrbScene({ className = '', theme = 'brand' }) {
  return <div className={`orbscene t-${theme} ${className}`} aria-hidden="true" />;
}
