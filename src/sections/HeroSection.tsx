import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import DrifaLogo from '@/components/DrifaLogo';
import ScrollIndicator from '@/components/ScrollIndicator';

interface HeroSectionProps {
  reducedMotion: boolean;
}

export default function HeroSection({ reducedMotion }: HeroSectionProps) {
  const logoRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const sublineRef = useRef<HTMLParagraphElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) {
      // Show everything immediately
      [logoRef, headlineRef, sublineRef, scrollRef].forEach(
        (ref) => {
          if (ref.current) {
            gsap.set(ref.current, { opacity: 1, y: 0 });
          }
        }
      );
      return;
    }

    const tl = gsap.timeline({ delay: 0.2 });

    // Phase 1: Logo (0ms)
    tl.fromTo(
      logoRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
      0
    );

    // Phase 2: Morphing shape canvas fade (300ms)
    // The canvas opacity is controlled by the canvas container in App.tsx
    // We animate its opacity via a ref or direct selector
    const canvasContainer = document.querySelector('[data-canvas-container]');
    if (canvasContainer) {
      tl.fromTo(
        canvasContainer,
        { opacity: 0 },
        { opacity: 0.9, duration: 1.2, ease: 'power2.out' },
        0.3
      );
    }

    // Phase 3: Headline word stagger (600ms)
    if (headlineRef.current) {
      const words = headlineRef.current.querySelectorAll('.word');
      tl.fromTo(
        words,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' },
        0.6
      );
    }

    // Phase 4: Sub-headline (900ms)
    tl.fromTo(
      sublineRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      0.9
    );

    // Phase 5: Scroll indicator (1100ms)
    tl.fromTo(
      scrollRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: 'power2.out' },
      1.1
    );

    return () => {
      tl.kill();
    };
  }, [reducedMotion]);

  // Split headline into words for stagger animation
  const headline = "Vi Bygger Något Kraftfullt";
  const headlineWords = headline.split(' ');

  return (
    <section
      className="relative flex flex-col items-center justify-between w-screen"
      style={{
        height: '100dvh',
        minHeight: '100dvh',
        padding: '2rem clamp(1.5rem, 5vw, 4rem)',
        overflow: 'hidden',
        zIndex: 1,
      }}
    >
      {/* Logo */}
      <div ref={logoRef} style={{ opacity: 0, marginTop: '1rem' }}>
        <DrifaLogo className="w-[140px] h-auto" variant="light" />
      </div>

      {/* Main Content Block */}
      <div
        className="flex flex-col items-center text-center"
        style={{ maxWidth: '680px', margin: 'auto 0' }}
      >
        {/* Headline */}
        <h1
          ref={headlineRef}
          className="font-extrabold"
          style={{
            fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            color: '#FFFFFF',
            marginBottom: '1.25rem',
            textWrap: 'balance',
          }}
        >
          {headlineWords.map((word, i) => (
            <span
              key={i}
              className="word inline-block"
              style={{ marginRight: '0.3em' }}
            >
              {word}
            </span>
          ))}
        </h1>

        {/* Sub-headline */}
        <p
          ref={sublineRef}
          className="font-medium"
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            letterSpacing: '0.02em',
            lineHeight: 1.4,
            color: '#9CA3AF',
            maxWidth: '520px',
            margin: '0 auto 2.5rem',
          }}
        >
          Drifa specialiserar sig på banbrytande mjukvarulösningar. Vår nya webbplats är under utveckling.
        </p>

      </div>

      {/* Scroll Indicator */}
      <div ref={scrollRef} style={{ opacity: 0 }}>
        <ScrollIndicator reducedMotion={reducedMotion} />
      </div>
    </section>
  );
}
