import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';

const Robot = (props) => {
  const headRef = useRef();
  const bodyRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Head bobbing
    headRef.current.position.y = Math.sin(t * 2) * 0.05 + 1.2;
    // Body breathing
    bodyRef.current.scale.y = 1 + Math.sin(t * 2) * 0.02;
  });

  return (
    <group {...props}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        {/* Head */}
        <group ref={headRef} position={[0, 1.2, 0]}>
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.35, 32, 32]} />
            <meshStandardMaterial color="#22d3ee" roughness={0.2} metalness={0.8} />
          </mesh>
          {/* Eyes */}
          <mesh position={[-0.12, 0.05, 0.28]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="black" roughness={0.2} />
          </mesh>
          <mesh position={[0.12, 0.05, 0.28]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="black" roughness={0.2} />
          </mesh>
          {/* Antenna */}
          <mesh position={[0, 0.4, 0]}>
             <cylinderGeometry args={[0.02, 0.02, 0.3]} />
             <meshStandardMaterial color="#64748b" />
          </mesh>
          <mesh position={[0, 0.6, 0]}>
             <sphereGeometry args={[0.05]} />
             <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} />
          </mesh>
        </group>

        {/* Body */}
        <group ref={bodyRef} position={[0, 0.4, 0]}>
          <mesh castShadow receiveShadow>
            <capsuleGeometry args={[0.3, 0.7, 4, 8]} />
            <meshStandardMaterial color="white" roughness={0.3} metalness={0.5} />
          </mesh>
          {/* Badge */}
          <mesh position={[0, 0.1, 0.28]}>
            <boxGeometry args={[0.2, 0.2, 0.05]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
        </group>
        
        {/* Arms */}
        <mesh position={[-0.4, 0.5, 0]} rotation={[0, 0, 0.5]}>
           <capsuleGeometry args={[0.08, 0.4]} />
           <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[0.4, 0.5, 0]} rotation={[0, 0, -0.5]}>
           <capsuleGeometry args={[0.08, 0.4]} />
           <meshStandardMaterial color="white" />
        </mesh>
      </Float>
    </group>
  );
}

const ThreeAgent = () => {
  return (
    <div className="w-full h-full">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-mapSize={2048} castShadow />
        <Environment preset="city" />
        
        <Robot position={[0, -0.5, 0]} />
        
        <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
        <OrbitControls enableZoom={false} minPolarAngle={Math.PI / 2.5} maxPolarAngle={Math.PI / 1.5} />
      </Canvas>
    </div>
  );
};

export default ThreeAgent;
