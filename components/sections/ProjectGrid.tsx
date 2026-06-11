'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '@/data/projects';
import ProjectCard from '@/components/cards/ProjectCard';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!gridRef.current) return;

      const cards = gridRef.current.querySelectorAll('.project-card');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="work" className="relative px-6 py-24 md:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <h2
          className="font-display mb-16 text-section font-extrabold"
          style={{ color: 'var(--text-primary)' }}
        >
          My works
        </h2>

        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-4 md:grid-cols-12"
        >
          {projects.map((project) => (
            <div
              key={project.id}
              className={`project-card ${
                project.featured
                  ? 'md:col-span-6'
                  : 'md:col-span-4'
              }`}
              style={{ opacity: 0 }}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
