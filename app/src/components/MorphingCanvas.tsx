import { useRef, useEffect } from 'react';

interface Point {
  x: number;
  y: number;
}

interface Keyframe {
  points: Point[];
}

// Generate keyframes: hexagon → diamond → circle-like → angular variant → back to hexagon
function generateKeyframes(): Keyframe[] {
  const kfs: Keyframe[] = [];

  // 0: Hexagon (pointing right - like Drifa D shape)
  kfs.push({
    points: [
      { x: 1.0, y: 0 },
      { x: 0.5, y: -0.866 },
      { x: -0.5, y: -0.866 },
      { x: -1.0, y: 0 },
      { x: -0.5, y: 0.866 },
      { x: 0.5, y: 0.866 },
    ],
  });

  // 1: Diamond / rotated square
  kfs.push({
    points: [
      { x: 1.0, y: 0 },
      { x: 0, y: -1.0 },
      { x: -1.0, y: 0 },
      { x: 0, y: 1.0 },
      { x: 0.7, y: 0.7 },
      { x: 0.7, y: -0.7 },
    ],
  });

  // 2: Circle approximation (8 points)
  kfs.push({
    points: [
      { x: 1.0, y: 0 },
      { x: 0.707, y: -0.707 },
      { x: 0, y: -1.0 },
      { x: -0.707, y: -0.707 },
      { x: -1.0, y: 0 },
      { x: -0.707, y: 0.707 },
      { x: 0, y: 1.0 },
      { x: 0.707, y: 0.707 },
    ],
  });

  // 3: Angular / star-like
  kfs.push({
    points: [
      { x: 1.0, y: 0 },
      { x: 0.3, y: -0.3 },
      { x: 0, y: -1.0 },
      { x: -0.8, y: -0.5 },
      { x: -1.0, y: 0.2 },
      { x: -0.4, y: 0.8 },
      { x: 0.3, y: 1.0 },
      { x: 0.9, y: 0.5 },
    ],
  });

  // 4: Extended hexagonal D shape (more like Drifa logo)
  kfs.push({
    points: [
      { x: 0.9, y: -0.5 },
      { x: 0.9, y: 0.5 },
      { x: 0.3, y: 1.0 },
      { x: -0.6, y: 0.8 },
      { x: -1.0, y: 0 },
      { x: -0.6, y: -0.8 },
      { x: 0.3, y: -1.0 },
      { x: 0.9, y: -0.5 },
    ],
  });

  // Close the loop back to hexagon
  kfs.push(kfs[0]);

  return kfs;
}

// Smooth ease-in-out-sine
function smoothEase(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

// Interpolate between two keyframes with equalized point counts
function interpolatePoints(kfA: Keyframe, kfB: Keyframe, t: number): Point[] {
  const maxLen = Math.max(kfA.points.length, kfB.points.length);
  const result: Point[] = [];

  for (let i = 0; i < maxLen; i++) {
    const a = kfA.points[i % kfA.points.length];
    const b = kfB.points[i % kfB.points.length];
    result.push({
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t,
    });
  }

  return result;
}

interface MorphingCanvasProps {
  reducedMotion: boolean;
}

export default function MorphingCanvas({ reducedMotion }: MorphingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const frozenRef = useRef<boolean>(reducedMotion);

  useEffect(() => {
    frozenRef.current = reducedMotion;
  }, [reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const keyframes = generateKeyframes();
    const cycleDuration = 8000; // 8 seconds per full cycle
    const spokeCount = 12;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener('resize', resize);

    if (frozenRef.current) {
      // Draw once at first keyframe
      drawFrame(0);
      return () => {
        window.removeEventListener('resize', resize);
      };
    }

    startTimeRef.current = performance.now();

    function drawFrame(elapsed: number) {
      if (!ctx || !canvas) return;
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      const centerX = w / 2;
      const centerY = h / 2;
      const size = Math.min(w, h) * 0.35;

      // Progress through the cycle
      const cycleT = (elapsed % cycleDuration) / cycleDuration;
      const segmentCount = keyframes.length - 1;
      const segmentT = cycleT * segmentCount;
      const segmentIndex = Math.floor(segmentT);
      const localT = smoothEase(segmentT - segmentIndex);

      const fromKf = keyframes[Math.min(segmentIndex, keyframes.length - 2)];
      const toKf = keyframes[Math.min(segmentIndex + 1, keyframes.length - 1)];

      const points = interpolatePoints(fromKf, toKf, localT);

      // Secondary smaller shape (30% scale, counter-rotation, 2x speed)
      const secondaryAngle = -elapsed * 0.0005 * 2; // 2x speed, opposite direction
      const secondarySize = size * 0.3;
      const secPoints = interpolatePoints(
        keyframes[(segmentIndex + 2) % (keyframes.length - 1)],
        keyframes[(segmentIndex + 3) % (keyframes.length - 1)],
        localT
      );

      // Draw secondary shape
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(secondaryAngle);
      ctx.beginPath();
      secPoints.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x * secondarySize, p.y * secondarySize);
        else ctx.lineTo(p.x * secondarySize, p.y * secondarySize);
      });
      ctx.closePath();
      ctx.strokeStyle = 'rgba(6, 214, 160, 0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = 'rgba(6, 214, 160, 0.01)';
      ctx.fill();
      ctx.restore();

      // Primary shape
      ctx.save();
      ctx.translate(centerX, centerY);

      // Slight rotation based on time
      const primaryAngle = elapsed * 0.00015;
      ctx.rotate(primaryAngle);

      // Draw shape
      ctx.beginPath();
      points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x * size, p.y * size);
        else ctx.lineTo(p.x * size, p.y * size);
      });
      ctx.closePath();

      ctx.strokeStyle = 'rgba(6, 214, 160, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = 'rgba(6, 214, 160, 0.02)';
      ctx.fill();

      // Radial spokes
      const spokeAlpha = 0.05 + Math.sin(elapsed * 0.001) * 0.05;
      for (let i = 0; i < spokeCount; i++) {
        const angle = (i / spokeCount) * Math.PI * 2 + elapsed * 0.0002;
        const r = size * 0.85;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        ctx.strokeStyle = `rgba(6, 214, 160, ${spokeAlpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Center dot
      ctx.beginPath();
      ctx.arc(0, 0, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(6, 214, 160, 0.3)';
      ctx.fill();

      ctx.restore();
    }

    function animate(now: number) {
      if (frozenRef.current) return;
      if (document.hidden) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }

      const elapsed = now - startTimeRef.current;
      drawFrame(elapsed);
      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
