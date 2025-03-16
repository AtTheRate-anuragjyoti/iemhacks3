'use client';

import React, { useRef, Suspense, useState, forwardRef } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { KernelSize } from 'postprocessing';
import * as THREE from 'three';

// Custom shader material for the glowing orb
const OrbMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor1: new THREE.Color(0x06001f), // Deep cosmic blue
    uColor2: new THREE.Color(0x6a00f4), // Vibrant purple glow
    uColor3: new THREE.Color(0x00aaff), // Cyan center light
  },
  /*glsl*/`
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float uTime;

    void main() {
      vUv = uv;
      vPosition = position;

      vec3 newPosition = position;

      // ** Smoother, organic waves **
      float wave1 = sin(uTime * 1.2 + position.x * 4.0 + position.y * 3.5) * 0.06;
      float wave2 = cos(uTime * 2.0 + position.z * 3.0 + position.x * 2.0) * 0.05;
      float wave3 = sin(uTime * 0.9 + position.y * 5.0 + position.z * 2.5) * 0.04;
      
      newPosition += normal * (wave1 + wave2 + wave3);

      // ** Pulsation effect - like breathing **
      float pulse = sin(uTime * 1.8) * 0.025;
      newPosition += normal * pulse;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  /*glsl*/`
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;

    float noise(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    void main() {
      vec2 center = vec2(0.5, 0.5);
      float dist = distance(vUv, center) * 2.0;
      
      float wavePattern = abs(sin(vPosition.x * 6.0 + vPosition.y * 5.0 + vPosition.z * 4.0 + uTime * 0.5));
      float linePattern = smoothstep(0.7, 0.95, wavePattern);

      float pulse = 0.4 + 0.2 * sin(uTime * 0.6);
      
      vec3 baseColor = mix(uColor1, uColor2, smoothstep(0.3, 0.85, dist));
      float centerGlow = smoothstep(0.9, 0.1, dist) * (0.8 + 0.3 * pulse);
      vec3 color = mix(baseColor, uColor3, centerGlow);
      
      float glow = 0.3 + 0.2 * sin(uTime + dist * 3.0);
      color *= 1.0 + glow * 0.2;
      
      float brightCenter = pow(smoothstep(0.5, 0.1, dist), 2.0) * (0.9 + 0.2 * pulse);
      color = mix(color, uColor3, brightCenter);

      float noiseTexture = noise(vUv * 15.0 + uTime * 0.1) * 0.05;
      color += vec3(noiseTexture) * (1.0 - dist);
      
      float alpha = smoothstep(1.3, 0.8, dist);
      gl_FragColor = vec4(color, alpha);
    }
  `
);

extend({ OrbMaterial });

// Animated Orb Component
const AnimatedOrb = forwardRef((props, ref) => {
  const materialRef = useRef();

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();

    if (ref.current) {
      ref.current.rotation.x = Math.sin(elapsedTime * 0.05) * 0.1;
      ref.current.rotation.y = Math.cos(elapsedTime * 0.08) * 0.12;
    }

    if (materialRef.current) {
      materialRef.current.uTime = elapsedTime;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <sphereGeometry args={[2.2, 180, 180]} />
      <orbMaterial 
        ref={materialRef}
        uColor1={new THREE.Color(0x06001f)}
        uColor2={new THREE.Color(0x6a00f4)}
        uColor3={new THREE.Color(0x00aaff)}
        transparent
      />
    </mesh>
  );
});

// Scene Component (Fixing Orb Centering)
function Scene({ setOrbRef }) {
  const orbRef = useRef();

  return (
    <>
      <ambientLight intensity={0.15} color="#6a00f4" />
      <pointLight position={[0, 0, 5]} intensity={1.0} color="#00aaff" />
      <pointLight position={[3, 3, 0]} intensity={0.6} color="#6a00f4" />
      <AnimatedOrb ref={orbRef} />
    </>
  );
}

// Bloom Effect
function PostEffects() {
  return (
    <EffectComposer>
      <Bloom intensity={0.8} kernelSize={KernelSize.SMALL} luminanceThreshold={0.5} luminanceSmoothing={0.7} />
    </EffectComposer>
  );
}

// OrbCanvas Component (Fixing Positioning)
function OrbCanvas() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 40 }}>
        <Suspense fallback={null}>
          <Scene />
          <PostEffects />
        </Suspense>
      </Canvas>
    </div>
  );
}

export { Scene, PostEffects, AnimatedOrb, OrbCanvas };
