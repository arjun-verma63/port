'use client';

import { useRef, useCallback } from 'react';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
}

export default function MagneticButton({
  children,
  className = '',
  style = {},
  type = 'button',
  disabled = false,
  onClick,
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!btnRef.current || disabled) return;

      const rect = btnRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxRadius = 60;

      if (distance < maxRadius) {
        const strength = 1 - distance / maxRadius;
        const moveX = dx * strength * 0.3;
        const moveY = dy * strength * 0.3;
        btnRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }
    },
    [disabled]
  );

  const handleMouseLeave = useCallback(() => {
    if (btnRef.current) {
      btnRef.current.style.transform = 'translate(0, 0)';
    }
  }, []);

  return (
    <button
      ref={btnRef}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`cursor-pointer transition-transform duration-200 ease-out ${className}`}
      style={{
        backgroundColor: 'var(--accent-metal)',
        color: '#0A0A0B',
        borderRadius: '9999px',
        border: 'none',
        padding: '14px 40px',
        fontSize: '13px',
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase' as const,
        ...style,
      }}
    >
      {children}
    </button>
  );
}
