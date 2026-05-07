import { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface DigitSlotProps {
  value: string;
  reducedMotion: boolean;
}

export default function DigitSlot({ value, reducedMotion }: DigitSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevValue = useRef<string>(value);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevValue.current = value;
      return;
    }

    if (prevValue.current === value) return;
    if (reducedMotion) {
      prevValue.current = value;
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Create old and new digit elements for animation
    const oldDigit = document.createElement('div');
    oldDigit.textContent = prevValue.current;
    oldDigit.style.position = 'absolute';
    oldDigit.style.top = '0';
    oldDigit.style.left = '0';
    oldDigit.style.width = '100%';
    oldDigit.style.textAlign = 'center';

    const newDigit = document.createElement('div');
    newDigit.textContent = value;
    newDigit.style.position = 'absolute';
    newDigit.style.top = '0';
    newDigit.style.left = '0';
    newDigit.style.width = '100%';
    newDigit.style.textAlign = 'center';
    newDigit.style.transform = 'translateY(100%)';
    newDigit.style.opacity = '0';

    container.appendChild(oldDigit);
    container.appendChild(newDigit);

    const tl = gsap.timeline({
      onComplete: () => {
        oldDigit.remove();
        newDigit.remove();
        if (containerRef.current) {
          containerRef.current.querySelector('.static-digit')?.setAttribute('data-value', value);
        }
      },
    });

    tl.to(oldDigit, {
      y: '-100%',
      opacity: 0,
      duration: 0.3,
      ease: 'power2.inOut',
    }, 0);

    tl.to(newDigit, {
      y: '0%',
      opacity: 1,
      duration: 0.3,
      ease: 'power2.inOut',
    }, 0);

    prevValue.current = value;
  }, [value, reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      style={{
        height: '1.2em',
        minWidth: '0.7em',
      }}
    >
      <div className="static-digit" data-value={value}>
        {value}
      </div>
    </div>
  );
}
