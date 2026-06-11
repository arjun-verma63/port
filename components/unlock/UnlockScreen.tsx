'use client';

import { useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import SafeModel from './SafeModel';
import { usePortfolioStore } from '@/store/usePortfolioStore';

export default function UnlockScreen() {
  const setUnlocked = usePortfolioStore((state) => state.setUnlocked);
  const safeRef = useRef<{ triggerUnlock: () => void } | null>(null);

  const handleUnlock = useCallback(() => {
    if (safeRef.current) {
      safeRef.current.triggerUnlock();
    }
  }, []);

  const handleSkip = useCallback(() => {
    setUnlocked(true);
  }, [setUnlocked]);

  const handleComplete = useCallback(() => {
    setUnlocked(true);
  }, [setUnlocked]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{
        background:
          'radial-gradient(ellipse at center, rgba(30,40,60,0.8) 0%, var(--bg-primary) 80%)',
      }}
    >
      {/* R3F Canvas — full viewport */}
      <div className="pointer-events-none absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 4.5], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.3} />
          <directionalLight position={[2, 3, 2]} intensity={1.2} />
          <pointLight
            position={[-1, 1, 3]}
            intensity={0.8}
            color="#C8A96E"
          />
          <Environment preset="city" />
          <SafeModel ref={safeRef} onComplete={handleComplete} />
        </Canvas>
      </div>

      {/* Unlock button */}
      <button
        onClick={handleUnlock}
        className="relative z-10 flex cursor-pointer items-center justify-center font-body uppercase tracking-[0.15em] transition-all duration-300"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90px',
          height: '90px',
          border: '1px solid var(--accent-metal)',
          color: 'var(--accent-metal)',
          backgroundColor: 'rgba(10, 10, 11, 0.3)',
          backdropFilter: 'blur(4px)',
          fontSize: '11px',
          borderRadius: '50%',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(200,169,110,0.15)';
          e.currentTarget.style.boxShadow =
            '0 0 30px rgba(200,169,110,0.2), inset 0 0 20px rgba(200,169,110,0.1)';
          e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(10, 10, 11, 0.3)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
        }}
      >
        ENTER
      </button>

      {/* Skip link — accessibility */}
      <button
        onClick={handleSkip}
        className="absolute bottom-6 right-8 z-10 cursor-pointer border-none bg-transparent font-body text-[11px] transition-colors duration-200 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-accent-cold"
        style={{
          color: 'var(--text-secondary)',
          textDecoration: 'none',
        }}
        tabIndex={0}
      >
        Skip →
      </button>
    </div>
  );
}
