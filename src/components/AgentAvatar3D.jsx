import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';

// --- Low Poly RPG Character Model ---
const RPGCharacter = ({ role, color }) => {
  const group = useRef();
  const headRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
        group.current.rotation.y = Math.sin(t * 0.5) * 0.1;
    }
  });

  // Skin Tone
  const skinColor = "#eeccab";

  // --- Character Parts ---

  const Head = () => (
    <group position={[0, 0.55, 0]}>
       {/* Face Shape - Squarish/Chibi style */}
       <mesh>
          <boxGeometry args={[0.35, 0.35, 0.32]} />
          <meshStandardMaterial color={skinColor} />
       </mesh>
       {/* Eyes */}
       <mesh position={[-0.08, 0, 0.17]}>
          <boxGeometry args={[0.04, 0.08, 0.02]} />
          <meshStandardMaterial color="black" />
       </mesh>
       <mesh position={[0.08, 0, 0.17]}>
          <boxGeometry args={[0.04, 0.08, 0.02]} />
          <meshStandardMaterial color="black" />
       </mesh>
       {/* Nose */}
       <mesh position={[0, -0.05, 0.17]}>
          <boxGeometry args={[0.04, 0.04, 0.04]} />
          <meshStandardMaterial color="#e2b08e" />
       </mesh>
       {/* Eyebrows */}
       <mesh position={[-0.08, 0.08, 0.17]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.08, 0.02, 0.02]} />
          <meshStandardMaterial color="#3f2e22" />
       </mesh>
       <mesh position={[0.08, 0.08, 0.17]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.08, 0.02, 0.02]} />
          <meshStandardMaterial color="#3f2e22" />
       </mesh>
    </group>
  );

  const KnightArmor = () => (
    <group>
       {/* Helmet */}
       <group position={[0, 0.58, 0]}>
          <mesh position={[0, 0.1, 0]}>
             <boxGeometry args={[0.38, 0.25, 0.38]} />
             <meshStandardMaterial color="#94a3b8" />
          </mesh>
          <mesh position={[0, 0.25, 0]}>
             <coneGeometry args={[0.1, 0.2, 4]} />
             <meshStandardMaterial color="#94a3b8" />
          </mesh>
       </group>
       {/* Chestplate */}
       <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.35, 0.45, 0.25]} />
          <meshStandardMaterial color="#64748b" />
       </mesh>
       {/* Shoulder Pads */}
       <mesh position={[-0.22, 0.3, 0]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.15, 0.15, 0.2]} />
          <meshStandardMaterial color="#475569" />
       </mesh>
       <mesh position={[0.22, 0.3, 0]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.15, 0.15, 0.2]} />
          <meshStandardMaterial color="#475569" />
       </mesh>
       {/* Belt */}
       <mesh position={[0, -0.05, 0.13]}>
          <boxGeometry args={[0.36, 0.08, 0.05]} />
          <meshStandardMaterial color="#78350f" />
       </mesh>
       <mesh position={[0, -0.05, 0.16]}>
          <boxGeometry args={[0.08, 0.06, 0.02]} />
          <meshStandardMaterial color="#fbbf24" />
       </mesh>
    </group>
  );

  const MageRobe = () => (
    <group>
       {/* Hair/Hood */}
       <group position={[0, 0.55, 0]}>
          <mesh position={[0, 0.1, -0.05]}>
             <boxGeometry args={[0.38, 0.38, 0.3]} />
             <meshStandardMaterial color="#4c1d95" />
          </mesh>
       </group>
       {/* Robe Body */}
       <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.15, 0.25, 0.55, 8]} />
          <meshStandardMaterial color="#5b21b6" />
       </mesh>
       {/* Scarf/Collar */}
       <mesh position={[0, 0.3, 0]} rotation={[0.2, 0, 0]}>
          <torusGeometry args={[0.16, 0.06, 8, 16]} />
          <meshStandardMaterial color="#a78bfa" />
       </mesh>
       {/* Belt with Pouch */}
       <mesh position={[0, 0, 0.14]}>
          <boxGeometry args={[0.32, 0.06, 0.04]} />
          <meshStandardMaterial color="#92400e" />
       </mesh>
       <mesh position={[0.1, -0.05, 0.14]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.08, 0.1, 0.05]} />
          <meshStandardMaterial color="#78350f" />
       </mesh>
    </group>
  );

  const PeasantOutfit = () => (
    <group>
       {/* Hair/Bandana */}
       <mesh position={[0, 0.72, 0]}>
          <boxGeometry args={[0.36, 0.1, 0.34]} />
          <meshStandardMaterial color="#92400e" />
       </mesh>
       {/* Beard */}
       <mesh position={[0, 0.45, 0.16]}>
           <coneGeometry args={[0.08, 0.15, 4]} rotation={[Math.PI, 0, 0]} />
           <meshStandardMaterial color="#78350f" />
       </mesh>
       {/* Tunic */}
       <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.32, 0.45, 0.22]} />
          <meshStandardMaterial color="#fef3c7" />
       </mesh>
       {/* Scarf */}
       <mesh position={[0, 0.32, 0]}>
          <torusGeometry args={[0.16, 0.05, 8, 16]} />
          <meshStandardMaterial color="#ea580c" />
       </mesh>
       {/* Gloves/Bracers */}
       <mesh position={[-0.22, 0.1, 0]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[0.1, 0.2, 0.12]} />
          <meshStandardMaterial color="#78350f" />
       </mesh>
       <mesh position={[0.22, 0.1, 0]} rotation={[0, 0, -0.1]}>
          <boxGeometry args={[0.1, 0.2, 0.12]} />
          <meshStandardMaterial color="#78350f" />
       </mesh>
    </group>
  );

  const getOutfit = () => {
     switch(role) {
         case '景区': // Knight Style (Guardian)
         case '交通':
             return <KnightArmor />;
         case '酒店': // Mage Style (Mysterious/Service)
         case '古镇':
             return <MageRobe />;
         case '餐饮': // Peasant/Innkeeper Style
             return <PeasantOutfit />;
         default:
             return <PeasantOutfit />;
     }
  }

  return (
    <group ref={group} position={[0, -0.3, 0]}>
       <Head />
       {getOutfit()}
       
       {/* Legs */}
       <mesh position={[-0.1, -0.3, 0]}>
          <boxGeometry args={[0.12, 0.4, 0.12]} />
          <meshStandardMaterial color="#334155" />
       </mesh>
       <mesh position={[0.1, -0.3, 0]}>
          <boxGeometry args={[0.12, 0.4, 0.12]} />
          <meshStandardMaterial color="#334155" />
       </mesh>
       
       {/* Boots */}
       <mesh position={[-0.1, -0.5, 0.05]}>
          <boxGeometry args={[0.14, 0.1, 0.2]} />
          <meshStandardMaterial color="#1e293b" />
       </mesh>
       <mesh position={[0.1, -0.5, 0.05]}>
          <boxGeometry args={[0.14, 0.1, 0.2]} />
          <meshStandardMaterial color="#1e293b" />
       </mesh>
    </group>
  );
};

const AgentAvatar3D = ({ role }) => {
  return (
    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-100 overflow-hidden relative">
      <Canvas camera={{ position: [0, 0.2, 2.2], fov: 40 }}>
        <ambientLight intensity={0.6} />
        <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-2, 1, 2]} intensity={0.5} color="#e0f2fe" />
        <Environment preset="city" />
        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.05}>
           <RPGCharacter role={role} />
        </Float>
      </Canvas>
    </div>
  );
};

export default AgentAvatar3D;
