import { useCountdown } from '@/hooks/useCountdown';
import CountdownUnit from './CountdownUnit';

interface CountdownTimerProps {
  reducedMotion: boolean;
}

const TARGET_DATE = new Date(Date.now() + 50 * 24 * 60 * 60 * 1000);

export default function CountdownTimer({ reducedMotion }: CountdownTimerProps) {
  const { days, hours, minutes, seconds } = useCountdown(TARGET_DATE);

  return (
    <div className="flex items-start justify-center gap-4 sm:gap-8" style={{ marginTop: '2.5rem' }}>
      <CountdownUnit value={days} label="Dagar" reducedMotion={reducedMotion} />
      <span
        className="font-light self-start hidden sm:block"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          color: '#4B5563',
          lineHeight: 1,
          marginTop: '0.05em',
        }}
      >
        :
      </span>
      <CountdownUnit value={hours} label="Timmar" reducedMotion={reducedMotion} />
      <span
        className="font-light self-start hidden sm:block"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          color: '#4B5563',
          lineHeight: 1,
          marginTop: '0.05em',
        }}
      >
        :
      </span>
      <CountdownUnit value={minutes} label="Minuter" reducedMotion={reducedMotion} />
      <span
        className="font-light self-start hidden sm:block"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          color: '#4B5563',
          lineHeight: 1,
          marginTop: '0.05em',
        }}
      >
        :
      </span>
      <CountdownUnit value={seconds} label="Sekunder" reducedMotion={reducedMotion} />
    </div>
  );
}
