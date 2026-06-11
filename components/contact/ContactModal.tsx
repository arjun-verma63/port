'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import MagneticButton from './MagneticButton';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const FORMSPREE_URL = 'https://formspree.io/f/YOUR_ID';

export default function ContactModal() {
  const isModalOpen = usePortfolioStore((state) => state.isModalOpen);
  const setModalOpen = usePortfolioStore((state) => state.setModalOpen);
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  // Store trigger element for focus return
  useEffect(() => {
    if (isModalOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
    }
  }, [isModalOpen]);

  const handleClose = useCallback(() => {
    setModalOpen(false);
    setSubmitted(false);
    setSubmitError(null);
    reset();
    // Return focus to trigger element
    setTimeout(() => {
      if (triggerRef.current) {
        triggerRef.current.focus();
      }
    }, 100);
  }, [setModalOpen, reset]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, handleClose]);

  // Focus trap
  useEffect(() => {
    if (!isModalOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    // Focus first element
    setTimeout(() => firstFocusable?.focus(), 100);

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    };

    modal.addEventListener('keydown', handleTab);
    return () => modal.removeEventListener('keydown', handleTab);
  }, [isModalOpen, submitted]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const onSubmit = async (data: FormData) => {
    setSubmitError(null);
    try {
      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitted(true);
        reset();
      } else {
        setSubmitError('Something went wrong. Please try again.');
      }
    } catch {
      setSubmitError('Network error. Please check your connection.');
    }
  };

  const inputStyle: React.CSSProperties = {
    background: 'transparent',
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    borderBottom: '1px solid var(--border-subtle)',
    padding: '12px 0',
    color: 'var(--text-primary)',
    width: '100%',
    outline: 'none',
    fontSize: '14px',
    fontFamily: 'var(--font-inter), Inter, sans-serif',
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60]"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Modal panel */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-1/2 z-[61] w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '40px',
            }}
            role="dialog"
            aria-label="Contact form"
            aria-modal="true"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-none transition-colors duration-200"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
              }}
              aria-label="Close contact form"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M3 3L11 11M11 3L3 11" />
              </svg>
            </button>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key="form"
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2
                    className="font-display mb-8 text-2xl font-extrabold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Get in Touch
                  </h2>

                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                    noValidate
                  >
                    <div>
                      <input
                        {...register('name', {
                          required: 'Name is required',
                        })}
                        type="text"
                        placeholder="Name"
                        style={{
                          ...inputStyle,
                          borderColor: errors.name
                            ? '#e53e3e'
                            : 'var(--border-subtle)',
                        }}
                        aria-invalid={errors.name ? 'true' : 'false'}
                      />
                      {errors.name && (
                        <span
                          className="mt-1 block font-body text-xs"
                          style={{ color: '#e53e3e' }}
                        >
                          {errors.name.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <input
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Invalid email address',
                          },
                        })}
                        type="email"
                        placeholder="Email"
                        style={{
                          ...inputStyle,
                          borderColor: errors.email
                            ? '#e53e3e'
                            : 'var(--border-subtle)',
                        }}
                        aria-invalid={errors.email ? 'true' : 'false'}
                      />
                      {errors.email && (
                        <span
                          className="mt-1 block font-body text-xs"
                          style={{ color: '#e53e3e' }}
                        >
                          {errors.email.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <textarea
                        {...register('message', {
                          required: 'Message is required',
                        })}
                        placeholder="Message"
                        rows={4}
                        style={{
                          ...inputStyle,
                          resize: 'none',
                          borderColor: errors.message
                            ? '#e53e3e'
                            : 'var(--border-subtle)',
                        }}
                        aria-invalid={errors.message ? 'true' : 'false'}
                      />
                      {errors.message && (
                        <span
                          className="mt-1 block font-body text-xs"
                          style={{ color: '#e53e3e' }}
                        >
                          {errors.message.message}
                        </span>
                      )}
                    </div>

                    {submitError && (
                      <p
                        className="font-body text-xs"
                        style={{ color: '#e53e3e' }}
                        role="alert"
                      >
                        {submitError}
                      </p>
                    )}

                    <div className="flex justify-end pt-2">
                      <MagneticButton type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </MagneticButton>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center py-8 text-center"
                >
                  {/* Checkmark animation */}
                  <svg
                    width="56"
                    height="56"
                    viewBox="0 0 56 56"
                    fill="none"
                    className="mb-6"
                  >
                    <circle
                      cx="28"
                      cy="28"
                      r="26"
                      stroke="#C8A96E"
                      strokeWidth="2"
                      opacity="0.3"
                    />
                    <motion.path
                      d="M18 28L25 35L38 22"
                      stroke="#C8A96E"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  </svg>

                  <h3
                    className="font-display text-xl font-extrabold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Message sent.
                  </h3>
                  <p
                    className="mt-2 font-body text-sm"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    I&apos;ll get back to you soon.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
