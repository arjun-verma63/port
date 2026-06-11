'use client';

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import DialRing, { type DialRingHandle } from './DialRing';
import { createUnlockTimeline } from './unlockSequence';

interface SafeModelProps {
  onComplete: () => void;
}

export interface SafeModelHandle {
  triggerUnlock: () => void;
}

const SafeModel = forwardRef<SafeModelHandle, SafeModelProps>(
  ({ onComplete }, ref) => {
    const groupRef = useRef<THREE.Group>(null);
    const dial1Ref = useRef<DialRingHandle>(null);
    const dial2Ref = useRef<DialRingHandle>(null);
    const dial3Ref = useRef<DialRingHandle>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);
    const { camera } = useThree();

    // Entrance Animation
    useEffect(() => {
      import('gsap').then(({ default: gsap }) => {
        if (groupRef.current) {
          gsap.from(groupRef.current.scale, {
            x: 0.01,
            y: 0.01,
            z: 0.01,
            duration: 2.5,
            ease: 'expo.out',
          });
          gsap.from(groupRef.current.rotation, {
            z: Math.PI * -2,
            duration: 3,
            ease: 'power3.out',
          });
        }
      });
    }, []);

    // Subtle idle float animation
    useFrame((state) => {
      if (groupRef.current) {
        groupRef.current.rotation.y =
          Math.sin(state.clock.elapsedTime * 0.3) * 0.03;
        groupRef.current.position.y =
          Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
      }
    });

    const metalMaterial = useMemo(
      () =>
        new THREE.MeshPhysicalMaterial({
          color: '#B58542', // Antique Brass
          metalness: 1.0,
          roughness: 0.3,
          clearcoat: 0.1,
          clearcoatRoughness: 0.3,
        }),
      []
    );

    const darkMetalMaterial = useMemo(
      () =>
        new THREE.MeshPhysicalMaterial({
          color: '#5C4033', // Dark Brown Bronze
          metalness: 0.9,
          roughness: 0.5,
          clearcoat: 0.05,
          clearcoatRoughness: 0.5,
        }),
      []
    );

    // Cleanup materials and geometries on unmount
    useEffect(() => {
      return () => {
        metalMaterial.dispose();
        darkMetalMaterial.dispose();
        if (timelineRef.current) {
          timelineRef.current.kill();
        }
      };
    }, [metalMaterial, darkMetalMaterial]);

    useImperativeHandle(ref, () => ({
      triggerUnlock: () => {
        if (
          dial1Ref.current &&
          dial2Ref.current &&
          dial3Ref.current
        ) {
          timelineRef.current = createUnlockTimeline(
            dial1Ref.current,
            dial2Ref.current,
            dial3Ref.current,
            groupRef.current,
            camera as THREE.PerspectiveCamera,
            onComplete
          );
        }
      },
    }));

    return (
      <group ref={groupRef}>
        {/* Outer casing ring with gear teeth (stationary) */}
        <mesh position={[0, 0, -0.05]}>
          <ringGeometry args={[1.68, 1.9, 64]} />
          <meshStandardMaterial
            color="#3A2818" // Very dark weathered bronze
            metalness={0.8}
            roughness={0.7}
          />
        </mesh>
        {/* Decorative inner bolts on the outer casing */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i / 24) * Math.PI * 2;
          return (
            <mesh
              key={`casing-bolt-${i}`}
              position={[
                Math.cos(angle) * 1.78,
                Math.sin(angle) * 1.78,
                -0.03,
              ]}
              rotation={[Math.PI / 2, 0, 0]}
              material={metalMaterial}
            >
              <cylinderGeometry args={[0.03, 0.03, 0.04, 16]} />
            </mesh>
          );
        })}

        {/* Outer Dial (Dial 1) */}
        <DialRing
          ref={dial1Ref}
          innerRadius={1.2}
          outerRadius={1.6}
          depth={0.1}
          metalMaterial={darkMetalMaterial}
          hasGearTeeth={true}
          hasRivets={true}
        />

        {/* Middle Dial (Dial 2) */}
        <DialRing
          ref={dial2Ref}
          innerRadius={0.8}
          outerRadius={1.18} // slight gap for decorative inner rings
          depth={0.12}
          metalMaterial={metalMaterial}
          hasRivets={true}
          numbers={['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI']}
        />

        {/* Inner Dial (Dial 3) */}
        <DialRing
          ref={dial3Ref}
          innerRadius={0.4}
          outerRadius={0.78}
          depth={0.14}
          metalMaterial={darkMetalMaterial}
          hasRivets={true}
        />
        
        {/* Separator Rings for depth/texture */}
        <mesh position={[0, 0, 0.11]}>
          <ringGeometry args={[1.18, 1.2, 64]} />
          <meshStandardMaterial color="#B58542" metalness={1} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.13]}>
          <ringGeometry args={[0.78, 0.8, 64]} />
          <meshStandardMaterial color="#8B6508" metalness={0.9} roughness={0.4} />
        </mesh>
      </group>
    );
  }
);

SafeModel.displayName = 'SafeModel';

export default SafeModel;
