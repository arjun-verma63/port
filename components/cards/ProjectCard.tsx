'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import type { Project } from '@/data/projects';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const setActiveProject = usePortfolioStore((state) => state.setActiveProject);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Lazy load video via IntersectionObserver
  useEffect(() => {
    if (!project.video || !videoRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !videoLoaded) {
            const video = videoRef.current;
            if (video) {
              video.src = project.video!;
              video.preload = 'metadata';
              setVideoLoaded(true);
            }
            observer.disconnect();
          }
        });
      },
      { rootMargin: '200px' }
    );

    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [project.video, videoLoaded]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    // CV variant: play video on hover
    if (project.variant === 'cv' && videoRef.current && videoLoaded) {
      const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
      if (!reducedMotion) {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [project.variant, videoLoaded]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (project.variant === 'cv' && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [project.variant]);

  const handleClick = useCallback(() => {
    setActiveProject(project.id);
  }, [project.id, setActiveProject]);

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative cursor-pointer overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: isHovered
          ? 'var(--bg-elevated)'
          : 'var(--bg-surface)',
        border: '1px solid',
        borderColor: isHovered
          ? project.accentColor
          : 'var(--border-subtle)',
        borderRadius: '8px',
        borderTopWidth: isHovered ? '2px' : '1px',
      }}
      aria-label={`View project: ${project.title}`}
    >
      {/* Image / Video container */}
      <div
        className="relative overflow-hidden"
        style={{
          height: project.featured ? '300px' : '220px',
        }}
      >
        {/* Placeholder gradient when no image */}
        <div
          className="absolute inset-0 transition-transform duration-400 ease-out"
          style={{
            background: `linear-gradient(135deg, ${project.accentColor}22 0%, var(--bg-elevated) 50%, ${project.accentColor}11 100%)`,
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />

        {/* CV variant video overlay */}
        {project.variant === 'cv' && project.video && (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
            style={{
              opacity: isHovered ? 1 : 0,
            }}
          />
        )}

        {/* Project title overlay on image */}
        <div className="absolute inset-0 flex items-end p-5">
          <div>
            <h3
              className="font-display text-lg font-extrabold"
              style={{ color: 'var(--text-primary)' }}
            >
              {project.title}
            </h3>
            <p
              className="mt-1 font-body text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              {project.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 p-4">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="font-body text-[10px] uppercase tracking-wide"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              color: 'var(--text-secondary)',
              padding: '4px 10px',
              borderRadius: '4px',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
