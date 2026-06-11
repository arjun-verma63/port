'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { usePortfolioStore } from '@/store/usePortfolioStore';

export default function HeroSection() {
  const setModalOpen = usePortfolioStore((state) => state.setModalOpen);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Name clip-path wipe from left
      if (nameRef.current) {
        gsap.fromTo(
          nameRef.current,
          {
            clipPath: 'inset(0 100% 0 0)',
            opacity: 1,
          },
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.4,
            ease: 'power2.out',
            delay: 0.2,
          }
        );
      }

      // Tagline fade-in
      if (taglineRef.current) {
        gsap.fromTo(
          taglineRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.5 }
        );
      }

      // Buttons stagger up
      if (buttonsRef.current) {
        gsap.fromTo(
          buttonsRef.current.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
            stagger: 0.15,
            delay: 0.7,
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const scrollToWork = () => {
    const el = document.getElementById('work');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden px-6"
    >
      {/* SVG vector field background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ opacity: 0.04 }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="field-lines"
              x="0"
              y="0"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              {/* Flow field lines — mathematical field pattern */}
              <path
                d="M10,40 C20,20 40,20 50,40 C60,60 80,60 90,40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
              <path
                d="M0,20 C15,10 25,30 40,20 C55,10 65,30 80,20"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.3"
              />
              <path
                d="M0,60 C15,50 25,70 40,60 C55,50 65,70 80,60"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.3"
              />
              {/* Arrows indicating field direction */}
              <polygon
                points="48,38 52,40 48,42"
                fill="currentColor"
                opacity="0.6"
              />
              <polygon
                points="38,18 42,20 38,22"
                fill="currentColor"
                opacity="0.4"
              />
              <circle cx="20" cy="40" r="1" fill="currentColor" opacity="0.3" />
              <circle cx="60" cy="40" r="1" fill="currentColor" opacity="0.3" />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#field-lines)"
            style={{ color: '#F0EDE8' }}
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl text-center">
        <h1
          ref={nameRef}
          className="font-display text-hero font-extrabold tracking-tight"
          style={{
            color: 'var(--text-primary)',
            clipPath: 'inset(0 100% 0 0)',
          }}
        >
          Arjun Verma
        </h1>

        <p
          ref={taglineRef}
          className="mt-5 font-body text-base opacity-0"
          style={{
            color: 'var(--text-secondary)',
            fontSize: '16px',
          }}
        >
          Full-Stack Engineer. Computer Vision.
        </p>

        <div ref={buttonsRef} className="mt-10 flex items-center justify-center gap-5">
          <button
            onClick={scrollToWork}
            className="cursor-pointer border font-body text-xs uppercase tracking-[0.15em] transition-all duration-300 hover:bg-accent-metal/10"
            style={{
              borderColor: 'var(--accent-metal)',
              color: 'var(--accent-metal)',
              padding: '14px 40px',
              backgroundColor: 'transparent',
              borderRadius: '0',
              opacity: 0,
            }}
          >
            View Work
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="cursor-pointer font-body text-xs uppercase tracking-[0.15em] transition-all duration-300"
            style={{
              backgroundColor: 'var(--accent-metal)',
              color: '#0A0A0B',
              padding: '14px 40px',
              border: 'none',
              borderRadius: '0',
              opacity: 0,
            }}
          >
            Get in Touch
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span
            className="font-body text-[10px] uppercase tracking-[0.2em]"
            style={{ color: 'var(--text-secondary)' }}
          >
            Scroll
          </span>
          <div
            className="h-8 w-px"
            style={{
              background:
                'linear-gradient(to bottom, var(--text-secondary), transparent)',
            }}
          />
        </div>
      </div>
    </section>
  );
}
