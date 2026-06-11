'use client';

import { usePortfolioStore } from '@/store/usePortfolioStore';

export default function Footer() {
  const setModalOpen = usePortfolioStore((state) => state.setModalOpen);

  return (
    <footer
      className="px-6 py-16 md:px-12 lg:px-20"
      style={{
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
        <div>
          <p
            className="font-display text-lg font-extrabold"
            style={{ color: 'var(--text-primary)' }}
          >
            Arjun Verma
          </p>
          <p
            className="mt-1 font-body text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            Aspiring SDE
          </p>
        </div>

        <div className="flex items-center gap-8">
          <button
            onClick={() => setModalOpen(true)}
            className="cursor-pointer border-none bg-transparent font-body text-sm transition-colors duration-200"
            style={{
              color: 'var(--accent-metal)',
              textDecoration: 'none',
            }}
          >
            av971102@gmail.com
          </button>

          <a
            href="https://github.com/arjun-verma63"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-sm transition-colors duration-200"
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
            }}
          >
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/arjun-verma-459897303/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-sm transition-colors duration-200"
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
            }}
          >
            LinkedIn
          </a>
        </div>

        <p
          className="font-body text-xs"
          style={{ color: 'var(--text-secondary)', opacity: 0.6 }}
        >
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
}
