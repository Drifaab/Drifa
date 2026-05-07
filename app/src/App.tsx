import { useReducedMotion } from '@/hooks/useReducedMotion';
import MorphingCanvas from '@/components/MorphingCanvas';
import HeroSection from '@/sections/HeroSection';

export default function App() {
  const reducedMotion = useReducedMotion();

  return (
    <>
      {/* Canvas background layer */}
      <div
        data-canvas-container
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          opacity: reducedMotion ? 0.6 : 0,
        }}
      >
        <MorphingCanvas reducedMotion={reducedMotion} />
      </div>

      {/* Content layer */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <HeroSection reducedMotion={reducedMotion} />
      </div>

      {/* Footer — outside viewport, visible on small screens / zoom */}
      <footer
        className="text-center"
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '1.5rem',
          color: '#4B5563',
          fontSize: '0.75rem',
        }}
      >
        <div
          style={{
            width: '60px',
            height: '1px',
            background: 'rgba(6, 214, 160, 0.15)',
            margin: '0 auto 1rem',
          }}
        />
        &copy; 2026 Drifa. Alla rättigheter förbehållna.
      </footer>
    </>
  );
}
