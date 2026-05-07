import { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface ScrollIndicatorProps {
  reducedMotion: boolean;
}

export default function ScrollIndicator({ reducedMotion }: ScrollIndicatorProps) {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion || !dotRef.current) return;

    const tween = gsap.to(dotRef.current, {
      y: 24,
      opacity: 0,
      duration: 2,
      ease: 'power1.inOut',
      repeat: -1,
      yoyo: true,
      repeatDelay: 0.5,
    });

    return () => {
      tween.kill();
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      className="flex flex-col items-center"
      style={{ marginBottom: '1rem', marginTop: '1.5rem' }}
    >
      <div className="relative" style={{ width: '1px', height: '32px' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(6, 214, 160, 0.3)',
            width: '1px',
          }}
        />
        <div
          ref={dotRef}
          style={{
            position: 'absolute',
            top: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: '#06D6A0',
            opacity: 1,
          }}
        />
      </div>
    </div>
  );
}
