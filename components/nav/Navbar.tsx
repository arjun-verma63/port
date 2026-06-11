'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'framer-motion';
import { usePortfolioStore } from '@/store/usePortfolioStore';

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const setModalOpen = usePortfolioStore((state) => state.setModalOpen);
  const [activeSection, setActiveSection] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);

  // ScrollTrigger for active section tracking
  useEffect(() => {
    const sections = ['work', 'skills'];
    const triggers: ScrollTrigger[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: 'top 40%',
        end: 'bottom 40%',
        onEnter: () => setActiveSection(id),
        onEnterBack: () => setActiveSection(id),
        onLeave: () => {
          if (id === 'skills') setActiveSection('');
        },
        onLeaveBack: () => {
          if (id === 'work') setActiveSection('');
        },
      });

      triggers.push(trigger);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  // Animate underline position
  useEffect(() => {
    if (!navRef.current || !underlineRef.current) return;

    const activeLink = navRef.current.querySelector(
      `[data-section="${activeSection}"]`
    ) as HTMLElement | null;

    if (activeLink) {
      const rect = activeLink.getBoundingClientRect();
      const navRect = navRef.current.getBoundingClientRect();

      gsap.to(underlineRef.current, {
        x: rect.left - navRect.left,
        width: rect.width,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    } else {
      gsap.to(underlineRef.current, {
        opacity: 0,
        duration: 0.2,
      });
    }
  }, [activeSection]);

  const handleNavClick = useCallback(
    (href: string) => {
      setMobileMenuOpen(false);

      if (href === '#contact') {
        setModalOpen(true);
        return;
      }

      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [setModalOpen]
  );

  return (
    <>
      <nav
        ref={navRef}
        className="fixed left-0 right-0 top-0 z-40 flex h-[60px] items-center justify-between px-6 md:px-12"
        style={{
          backgroundColor: 'rgba(10,10,11,0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        {/* Logo / Name */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-display text-base font-extrabold"
          style={{
            color: 'var(--text-primary)',
            textDecoration: 'none',
            fontSize: '16px',
          }}
        >
          AV
        </a>

        {/* Desktop links */}
        <div className="relative hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              data-section={link.href.replace('#', '')}
              onClick={() => handleNavClick(link.href)}
              className="cursor-pointer border-none bg-transparent font-body text-xs uppercase tracking-[0.1em] transition-colors duration-200"
              style={{
                color:
                  activeSection === link.href.replace('#', '')
                    ? 'var(--accent-cold)'
                    : 'var(--text-secondary)',
                padding: '8px 0',
              }}
            >
              {link.label}
            </button>
          ))}

          {/* Active underline */}
          <div
            ref={underlineRef}
            className="absolute -bottom-1 left-0 h-px"
            style={{
              backgroundColor: 'var(--accent-cold)',
              opacity: 0,
              width: 0,
            }}
          />
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex cursor-pointer flex-col gap-1.5 border-none bg-transparent p-2 md:hidden"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          <span
            className="block h-px w-5 transition-all duration-300"
            style={{
              backgroundColor: 'var(--text-primary)',
              transform: mobileMenuOpen
                ? 'rotate(45deg) translate(3px, 3px)'
                : 'none',
            }}
          />
          <span
            className="block h-px w-5 transition-all duration-300"
            style={{
              backgroundColor: 'var(--text-primary)',
              opacity: mobileMenuOpen ? 0 : 1,
            }}
          />
          <span
            className="block h-px w-5 transition-all duration-300"
            style={{
              backgroundColor: 'var(--text-primary)',
              transform: mobileMenuOpen
                ? 'rotate(-45deg) translate(3px, -3px)'
                : 'none',
            }}
          />
        </button>
      </nav>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 flex flex-col items-center justify-center gap-10 md:hidden"
            style={{ backgroundColor: 'var(--bg-primary)' }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.button
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.1 }}
                onClick={() => handleNavClick(link.href)}
                className="cursor-pointer border-none bg-transparent font-display text-3xl font-extrabold transition-colors duration-200"
                style={{ color: 'var(--text-primary)' }}
              >
                {link.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
