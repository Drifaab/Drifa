interface DrifaLogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export default function DrifaLogo({ className = '', variant = 'light' }: DrifaLogoProps) {
  const textColor = variant === 'light' ? '#FFFFFF' : '#06120A';

  return (
    <svg
      viewBox="0 0 138 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Drifa"
    >
      {/* Drifa icon - real logo */}
      <image
        href="/drifa-icon.png"
        x="0"
        y="2"
        width="34"
        height="34"
      />
      {/* Drifa text */}
      <text
        x="40"
        y="30"
        fill={textColor}
        fontFamily="'Inter', system-ui, sans-serif"
        fontWeight="700"
        fontSize="24"
        letterSpacing="-0.5"
      >
        Drifa
      </text>
    </svg>
  );
}
