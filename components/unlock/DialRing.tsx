'use client';

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface DialRingProps {
  innerRadius: number;
  outerRadius: number;
  depth: number;
  metalMaterial: THREE.MeshStandardMaterial;
  numbers?: (number | string)[];
  hasGearTeeth?: boolean;
  hasRivets?: boolean;
}

export interface DialRingHandle {
  meshRef: React.RefObject<THREE.Group>;
  flash: () => void;
  burstParticles: (scale?: number) => void;
}

const PARTICLE_COUNT = 16;

const DialRing = forwardRef<DialRingHandle, DialRingProps>(
  ({ innerRadius, outerRadius, depth, metalMaterial, numbers = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'], hasGearTeeth = false, hasRivets = false }, ref) => {
    const groupRef = useRef<THREE.Group>(null!);
    const instancedRef = useRef<THREE.InstancedMesh>(null!);
    const flashRef = useRef<THREE.Mesh>(null!);
    const [showFlash, setShowFlash] = useState(false);
    const particleAnimRef = useRef<{
      active: boolean;
      startTime: number;
      scale: number;
    }>({
      active: false,
      startTime: 0,
      scale: 1,
    });

    const shape = useMemo(() => {
      const s = new THREE.Shape();
      
      if (hasGearTeeth) {
        const numTeeth = 48;
        const toothDepth = 0.08;
        for (let i = 0; i <= numTeeth * 2; i++) {
          const angle = (i / (numTeeth * 2)) * Math.PI * 2;
          const r = i % 2 === 0 ? outerRadius : outerRadius + toothDepth;
          if (i === 0) s.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
          else s.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        }
      } else {
        s.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);
      }

      if (innerRadius > 0) {
        const hole = new THREE.Path();
        hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
        s.holes.push(hole);
      }
      return s;
    }, [innerRadius, outerRadius, hasGearTeeth]);

    const extrudeSettings = useMemo(
      () => ({
        depth: depth,
        bevelEnabled: true,
        bevelThickness: 0.01,
        bevelSize: 0.01,
        bevelSegments: 2,
        curveSegments: 64,
      }),
      [depth]
    );

    // Particle geometry and material
    const particleGeo = useMemo(
      () => new THREE.BoxGeometry(0.02, 0.06, 0.01),
      []
    );
    const particleMat = useMemo(
      () =>
        new THREE.MeshStandardMaterial({
          color: '#C8A96E',
          metalness: 0.9,
          roughness: 0.2,
          transparent: true,
          opacity: 1,
        }),
      []
    );

    // Flash material
    const flashMat = useMemo(
      () =>
        new THREE.MeshBasicMaterial({
          color: '#C8A96E',
          transparent: true,
          opacity: 0,
        }),
      []
    );

    useEffect(() => {
      if (instancedRef.current) {
        const dummy = new THREE.Object3D();
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          dummy.position.set(0, 0, 0);
          dummy.scale.set(0, 0, 0);
          dummy.updateMatrix();
          instancedRef.current.setMatrixAt(i, dummy.matrix);
        }
        instancedRef.current.instanceMatrix.needsUpdate = true;
      }
    }, []);

    useEffect(() => {
      return () => {
        particleGeo.dispose();
        particleMat.dispose();
        flashMat.dispose();
      };
    }, [particleGeo, particleMat, flashMat]);

    useFrame((state) => {
      if (!particleAnimRef.current.active || !instancedRef.current) return;

      const elapsed =
        (state.clock.elapsedTime - particleAnimRef.current.startTime) * 1000;
      const dummy = new THREE.Object3D();

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
        const burstScale = particleAnimRef.current.scale;
        // Burst originates from the outer edge
        const baseRadius = outerRadius;

        if (elapsed < 150) {
          const t = elapsed / 150;
          const eased = 1 - Math.pow(1 - t, 2);
          const radius = baseRadius + eased * 0.4 * burstScale;
          dummy.position.set(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            depth / 2
          );
          dummy.scale.set(1, 1, 1);
        } else if (elapsed < 400) {
          const t = (elapsed - 150) / 250;
          const radius = baseRadius + 0.4 * burstScale;
          dummy.position.set(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            depth / 2
          );
          const scale = Math.max(0, 1 - t);
          dummy.scale.set(scale, scale, scale);
        } else {
          dummy.position.set(0, 0, 0);
          dummy.scale.set(0, 0, 0);
          particleAnimRef.current.active = false;
        }

        dummy.updateMatrix();
        instancedRef.current.setMatrixAt(i, dummy.matrix);
      }

      instancedRef.current.instanceMatrix.needsUpdate = true;

      if (flashRef.current && showFlash) {
        if (elapsed < 100) {
          flashMat.opacity = (1 - elapsed / 100) * 0.8;
        } else {
          flashMat.opacity = 0;
          setShowFlash(false);
        }
      }
    });

    useImperativeHandle(ref, () => ({
      meshRef: groupRef,
      flash: () => {
        setShowFlash(true);
        if (flashMat) flashMat.opacity = 0.8;
      },
      burstParticles: (scale = 1) => {
        particleAnimRef.current = {
          active: true,
          startTime: performance.now() / 1000,
          scale,
        };
        if (instancedRef.current) {
          particleAnimRef.current.startTime = 0;
        }
      },
    }));

    useFrame((state) => {
      if (
        particleAnimRef.current.active &&
        particleAnimRef.current.startTime === 0
      ) {
        particleAnimRef.current.startTime = state.clock.elapsedTime;
      }
    });

    const textRadius = (innerRadius + outerRadius) / 2;

    return (
      <group ref={groupRef}>
        <mesh material={metalMaterial}>
          <extrudeGeometry args={[shape, extrudeSettings]} />
        </mesh>

        {numbers.map((num, i) => {
          const angle = -(i / numbers.length) * Math.PI * 2 + Math.PI / 2;
          return (
            <group
              key={num}
              position={[
                Math.cos(angle) * textRadius,
                Math.sin(angle) * textRadius,
                depth + 0.04,
              ]}
              rotation={[0, 0, angle - Math.PI / 2]}
            >
              <Text
                fontSize={(outerRadius - innerRadius) * 0.45}
                color="#E5C58A"
                anchorX="center"
                anchorY="middle"
              >
                {num.toString()}
              </Text>
            </group>
          );
        })}

        {/* Rivets */}
        {hasRivets &&
          Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            // Place rivets near the inner edge
            const rivetRadius = innerRadius + (outerRadius - innerRadius) * 0.15;
            return (
              <mesh
                key={`rivet-${i}`}
                position={[
                  Math.cos(angle) * rivetRadius,
                  Math.sin(angle) * rivetRadius,
                  depth + 0.01,
                ]}
                rotation={[Math.PI / 2, 0, 0]}
                material={metalMaterial}
              >
                <cylinderGeometry args={[0.02, 0.02, 0.02, 16]} />
              </mesh>
            );
          })}

        <mesh ref={flashRef} material={flashMat} position={[0, 0, depth + 0.02]}>
          <ringGeometry args={[innerRadius, outerRadius, 64]} />
        </mesh>

        <instancedMesh
          ref={instancedRef}
          args={[particleGeo, particleMat, PARTICLE_COUNT]}
        />
      </group>
    );
  }
);

DialRing.displayName = 'DialRing';

export default DialRing;
