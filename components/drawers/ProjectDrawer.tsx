'use client';

import { useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import { projects } from '@/data/projects';

export default function ProjectDrawer() {
  const activeProject = usePortfolioStore((state) => state.activeProject);
  const setActiveProject = usePortfolioStore((state) => state.setActiveProject);
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const project = activeProject
    ? projects.find((p) => p.id === activeProject) ?? null
    : null;

  // Store the element that triggered the drawer
  useEffect(() => {
    if (activeProject) {
      triggerRef.current = document.activeElement as HTMLElement;
    }
  }, [activeProject]);

  const handleClose = useCallback(() => {
    setActiveProject(null);
    // Return focus to trigger element
    if (triggerRef.current) {
      triggerRef.current.focus();
    }
  }, [setActiveProject]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeProject) {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeProject, handleClose]);

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 z-50 h-full w-full overflow-y-auto md:w-[480px]"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderLeft: '1px solid var(--border-subtle)',
            }}
            role="dialog"
            aria-label={`Project details: ${project.title}`}
            aria-modal="true"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute right-5 top-5 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none transition-colors duration-200"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-secondary)',
              }}
              aria-label="Close drawer"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M4 4L12 12M12 4L4 12" />
              </svg>
            </button>

            <div className="px-8 py-12">
              {/* Accent bar */}
              <div
                className="mb-6 h-1 w-12"
                style={{ backgroundColor: project.accentColor }}
              />

              {/* Title */}
              <h2
                className="font-display text-3xl font-extrabold"
                style={{ color: 'var(--text-primary)' }}
              >
                {project.title}
              </h2>

              <p
                className="mt-2 font-body text-sm"
                style={{ color: 'var(--text-secondary)' }}
              >
                {project.subtitle}
              </p>

              {/* Description */}
              <p
                className="mt-8 font-body text-sm leading-relaxed"
                style={{ color: 'var(--text-primary)', opacity: 0.85 }}
              >
                {project.description}
              </p>

              {/* Tech Stack */}
              <div className="mt-10">
                <h3
                  className="font-body text-xs uppercase tracking-[0.15em]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Tech Stack
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="font-body text-xs"
                      style={{
                        backgroundColor: 'var(--bg-elevated)',
                        color: 'var(--accent-cold)',
                        padding: '6px 14px',
                        borderRadius: '4px',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="mt-10 flex gap-4">
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-xs uppercase tracking-[0.15em] transition-all duration-200"
                    style={{
                      color: 'var(--accent-metal)',
                      borderBottom: '1px solid var(--accent-metal)',
                      paddingBottom: '2px',
                      textDecoration: 'none',
                    }}
                  >
                    Repository →
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-xs uppercase tracking-[0.15em] transition-all duration-200"
                    style={{
                      color: 'var(--accent-cold)',
                      borderBottom: '1px solid var(--accent-cold)',
                      paddingBottom: '2px',
                      textDecoration: 'none',
                    }}
                  >
                    Live Demo →
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
