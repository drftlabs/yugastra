export default function OrbScene({ className = '', theme = 'brand' }) {
  return (
    <div className={`orbscene t-${theme} ${className}`} aria-hidden="true">
      <div className="orb glow g1" /><div className="orb glow g2" /><div className="orb a" /><div className="dome" />
    </div>
  );
}
