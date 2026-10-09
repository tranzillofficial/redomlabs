'use client';
import { useEffect, useRef, useState } from 'react';

// Document memory, deliberately reset by refresh or a new visit.
let entrancePlayed = false;

export function SiteEntrance({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(() => !entrancePlayed);
  const [ready, setReady] = useState(false);
  const [fading, setFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setReady(true);
    if (!active) return;
    entrancePlayed = true;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches) {
      setActive(false);
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const finish = () => {
      setFading(true);
      setTimeout(() => {
        setActive(false);
        document.body.style.overflow = previousOverflow;
      }, 450);
    };

    // Fallback safety timeout
    const timer = setTimeout(finish, 5000);
    motion.addEventListener('change', finish, { once: true });

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      motion.removeEventListener('change', finish);
    };
  }, [active]);

  const handleEnded = () => {
    setFading(true);
    setTimeout(() => {
      setActive(false);
      document.body.style.overflow = '';
    }, 450);
  };

  return (
    <>
      {active && (
        <div
          className={`site-splash-screen ${fading ? 'splash-fade-out' : ''}`}
          aria-hidden="true"
        >
          <div className="splash-video-container">
            <video
              ref={videoRef}
              src="/splash.mp4"
              autoPlay
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              controls={false}
              onEnded={handleEnded}
              className="splash-video"
            />
          </div>
        </div>
      )}
      <div className={active ? 'site-content entrance-waiting' : 'site-content'} inert={active && ready}>
        {children}
      </div>
      <noscript>
        <style>{'.site-splash-screen{display:none!important}.entrance-waiting{visibility:visible!important}'}</style>
      </noscript>
    </>
  );
}
