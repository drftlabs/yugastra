'use client';
// Home hero: one square video, centred, looping forever. No controls, no text, no overlays.
export default function HeroVideo() {
  return (
    <section className="hero-vid" aria-label="YUGASTRA">
      <video
        src="/hero.mp4" poster="/hero-poster.jpg"
        autoPlay muted loop playsInline preload="auto"
        disablePictureInPicture disableRemotePlayback controlsList="nodownload noplaybackrate noremoteplayback"
        tabIndex={-1} aria-hidden="true"
        onContextMenu={(e) => e.preventDefault()}
        onPause={(e) => { if (!document.hidden) e.currentTarget.play().catch(() => {}); }}
      />
    </section>
  );
}
