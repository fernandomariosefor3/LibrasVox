import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  size = 40,
  className = '',
}) => {
  const fontSize = size;

  return (
    <span
      className={`font-black tracking-tighter ${className}`}
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize,
        background: 'linear-gradient(135deg, #059669 0%, #10b981 30%, #14b8a6 70%, #0d9488 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        filter: 'drop-shadow(0 2px 4px rgba(16,185,129,0.25))',
      }}
    >
      LVP
    </span>
  );
};

export default Logo;