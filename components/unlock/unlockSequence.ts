import gsap from 'gsap';
import * as THREE from 'three';

interface DialRef {
  meshRef: React.RefObject<THREE.Group>;
  flash: () => void;
  burstParticles: (scale?: number) => void;
}

export function createUnlockTimeline(
  dial1: DialRef,
  dial2: DialRef,
  dial3: DialRef,
  safeGroup: THREE.Group | null,
  camera: THREE.PerspectiveCamera,
  onComplete: () => void
): gsap.core.Timeline {
  if (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    onComplete();
    return gsap.timeline();
  }

  const tl = gsap.timeline({
    onComplete: () => {
      onComplete();
    },
  });

  // Initial heavy mechanical click / tension build-up
  if (safeGroup) {
    tl.to(
      safeGroup.position,
      {
        y: '-=0.01',
        duration: 0.1,
        ease: 'power4.in',
      },
      0
    ).to(
      safeGroup.position,
      {
        y: '+=0.01',
        duration: 0.8,
        ease: 'elastic.out(1, 0.3)',
      },
      0.1
    );
  }

  // Phase 1: Dial 1 (Outer) - Smooth, heavy mechanical spin
  if (dial1.meshRef.current) {
    tl.to(
      dial1.meshRef.current.rotation,
      {
        z: Math.PI * 2,
        duration: 1.2,
        ease: 'expo.inOut',
        onComplete: () => {
          dial1.flash();
          dial1.burstParticles(1);
        },
      },
      0.2
    );
  }

  // Phase 2: Dial 2 (Middle) - Staggered, overlapping spin
  if (dial2.meshRef.current) {
    tl.to(
      dial2.meshRef.current.rotation,
      {
        z: -Math.PI * 2,
        duration: 1.2,
        ease: 'expo.inOut',
        onComplete: () => {
          dial2.flash();
          dial2.burstParticles(1.2);
        },
      },
      0.6
    );
  }

  // Phase 3: Dial 3 (Inner) - Snaps into place
  if (dial3.meshRef.current) {
    tl.to(
      dial3.meshRef.current.rotation,
      {
        z: Math.PI * 4,
        duration: 1.2,
        ease: 'expo.inOut',
        onComplete: () => {
          dial3.flash();
          dial3.burstParticles(1.6);
        },
      },
      1.0
    );
  }

  // Phase 4: Final Lock Engagement (heavy mechanical snap)
  if (dial1.meshRef.current && dial2.meshRef.current && dial3.meshRef.current) {
    tl.to(
      [
        dial1.meshRef.current.rotation,
        dial2.meshRef.current.rotation,
        dial3.meshRef.current.rotation,
      ],
      {
        z: '+=0.02',
        duration: 0.05,
        yoyo: true,
        repeat: 1,
        ease: 'power4.inOut',
      },
      2.2
    );
  }

  // Phase 5: Cinematic Zoom-in
  if (camera) {
    tl.to(
      camera.position,
      {
        z: -0.5,
        duration: 1.2,
        ease: 'power3.inOut',
      },
      2.3
    );
  }

  // Fade out opacity/scale of the safe as we pass through the hole
  if (safeGroup) {
    tl.to(
      safeGroup.scale,
      {
        x: 1.5,
        y: 1.5,
        z: 1.5,
        duration: 1.2,
        ease: 'power3.inOut',
      },
      2.3
    );
  }

  return tl;
}
