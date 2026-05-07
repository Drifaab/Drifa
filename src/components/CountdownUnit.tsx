import DigitSlot from './DigitSlot';

interface CountdownUnitProps {
  value: string;
  label: string;
  reducedMotion: boolean;
}

export default function CountdownUnit({ value, label, reducedMotion }: CountdownUnitProps) {
  const digits = value.split('');

  return (
    <div className="flex flex-col items-center">
      <div
        className="flex items-center font-light tracking-tight"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          letterSpacing: '-0.04em',
          lineHeight: 1,
          color: '#FFFFFF',
        }}
      >
        {digits.map((digit, i) => (
          <DigitSlot key={i} value={digit} reducedMotion={reducedMotion} />
        ))}
      </div>
      <span
        className="mt-1 font-medium uppercase"
        style={{
          fontSize: '0.75rem',
          letterSpacing: '0.1em',
          color: '#4B5563',
        }}
      >
        {label}
      </span>
    </div>
  );
}
