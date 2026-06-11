'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Skill {
  name: string;
  level: number; // 0-100
}

interface SkillCategory {
  title: string;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    title: 'Full Stack',
    skills: [
      { name: 'React / Next.js', level: 95 },
      { name: 'Node.js / Express', level: 92 },
      { name: 'TypeScript', level: 90 },
      { name: 'PostgreSQL / MongoDB', level: 85 },
      { name: 'Docker / Kubernetes', level: 80 },
    ],
  },
  {
    title: 'Computer Vision',
    skills: [
      { name: 'OpenCV / Python', level: 93 },
      { name: 'YOLO Object Detection', level: 90 },
      { name: 'Kalman Filter Tracking', level: 88 },
      { name: 'TensorFlow / PyTorch', level: 82 },
      { name: 'Edge Deployment (Jetson)', level: 78 },
    ],
  },
];

export default function SkillsModule() {
  const sectionRef = useRef<HTMLElement>(null);
  const barsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      barsRef.current.forEach((bar) => {
        if (!bar) return;
        const level = bar.getAttribute('data-level');
        gsap.fromTo(
          bar,
          { width: '0%' },
          {
            width: `${level}%`,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: bar,
              start: 'top 90%',
              once: true,
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative px-6 py-24 md:px-12 lg:px-20"
    >
      <div className="mx-auto max-w-7xl">
        <h2
          className="font-display mb-16 text-section font-extrabold"
          style={{ color: 'var(--text-primary)' }}
        >
          Skills & Expertise
        </h2>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Left: Bio */}
          <div>
            <p
              className="font-body text-base leading-relaxed"
              style={{ color: 'var(--text-primary)', opacity: 0.85 }}
            >
              Aspiring SDE with a deep passion for building
              systems that bridge the gap between theoretical elegance and
              production reliability. My work spans full-stack web
              applications handling thousands of concurrent users,
              real-time computer vision pipelines deployed on edge
              devices, and numerical solvers rooted in differential
              equations and multivariable calculus.
            </p>
            <p
              className="mt-4 font-body text-base leading-relaxed"
              style={{ color: 'var(--text-primary)', opacity: 0.85 }}
            >
              I believe the best engineering happens at the intersection
              of clean code and practical craft — where a
              Kalman filter isn&apos;t just theory but a centroid tracker
              running at 30 FPS on a Jetson Nano, and where complex logic
              becomes an interactive seamless
              experience.
            </p>

            {/* Download Resume */}
            <a
              href="/resume.pdf"
              download
              className="mt-8 inline-block font-body text-xs uppercase tracking-[0.15em] transition-all duration-300 hover:bg-accent-metal/10"
              style={{
                border: '1px solid var(--border-active)',
                color: 'var(--accent-metal)',
                padding: '12px 32px',
                textDecoration: 'none',
              }}
            >
              Download Resume
            </a>
          </div>

          {/* Right: Skill bars */}
          <div className="space-y-10">
            {skillCategories.map((category) => (
              <div key={category.title}>
                <h3
                  className="font-body mb-5 text-xs uppercase tracking-[0.15em]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {category.title}
                </h3>
                <div className="space-y-4">
                  {category.skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="mb-1.5 flex items-center justify-between">
                        <span
                          className="font-body text-sm"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {skill.name}
                        </span>
                        <span
                          className="font-mono text-xs"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {skill.level}%
                        </span>
                      </div>
                      <div
                        className="h-1 w-full overflow-hidden rounded-full"
                        style={{
                          backgroundColor: 'var(--bg-elevated)',
                        }}
                      >
                        <div
                          ref={(el) => {
                            if (el) {
                              barsRef.current.push(el);
                            }
                          }}
                          data-level={skill.level}
                          className="h-full rounded-full"
                          style={{
                            backgroundColor:
                              category.title === 'Full Stack'
                                ? 'var(--accent-cold)'
                                : category.title === 'Computer Vision'
                                  ? 'var(--accent-glow)'
                                  : 'var(--accent-metal)',
                            width: '0%',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
