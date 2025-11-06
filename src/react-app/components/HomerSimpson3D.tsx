import { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Box, Cylinder } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function HomerHead({ onClick, isAnimating }: { onClick: () => void; isAnimating: boolean }) {
  const headRef = useRef<THREE.Group>(null);
  const eyeLeftRef = useRef<THREE.Mesh>(null);
  const eyeRightRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (headRef.current && isAnimating) {
      headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
    
    // Blinking animation
    if (eyeLeftRef.current && eyeRightRef.current) {
      const blink = Math.sin(state.clock.elapsedTime * 3) > 0.98 ? 0.1 : 1;
      eyeLeftRef.current.scale.y = blink;
      eyeRightRef.current.scale.y = blink;
    }
  });

  return (
    <group ref={headRef} onClick={onClick} position={[0, 0.5, 0]}>
      {/* Head */}
      <Sphere args={[1.2, 16, 16]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#FFD700" />
      </Sphere>
      
      {/* Eyes */}
      <Sphere ref={eyeLeftRef} args={[0.15, 8, 8]} position={[-0.3, 0.2, 0.8]}>
        <meshStandardMaterial color="white" />
      </Sphere>
      <Sphere ref={eyeRightRef} args={[0.15, 8, 8]} position={[0.3, 0.2, 0.8]}>
        <meshStandardMaterial color="white" />
      </Sphere>
      
      {/* Pupils */}
      <Sphere args={[0.08, 8, 8]} position={[-0.25, 0.2, 0.9]}>
        <meshStandardMaterial color="black" />
      </Sphere>
      <Sphere args={[0.08, 8, 8]} position={[0.35, 0.2, 0.9]}>
        <meshStandardMaterial color="black" />
      </Sphere>
      
      {/* Nose */}
      <Sphere args={[0.05, 8, 8]} position={[0, -0.1, 0.9]}>
        <meshStandardMaterial color="#FFD700" />
      </Sphere>
      
      {/* Mouth */}
      <Box args={[0.3, 0.05, 0.05]} position={[0, -0.4, 0.8]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      
      {/* Hair strands */}
      <Cylinder args={[0.02, 0.02, 0.3]} position={[-0.6, 0.8, 0]} rotation={[0, 0, Math.PI / 6]}>
        <meshStandardMaterial color="#8B4513" />
      </Cylinder>
      <Cylinder args={[0.02, 0.02, 0.2]} position={[-0.2, 0.9, 0]} rotation={[0, 0, Math.PI / 8]}>
        <meshStandardMaterial color="#8B4513" />
      </Cylinder>
      <Cylinder args={[0.02, 0.02, 0.25]} position={[0.4, 0.85, 0]} rotation={[0, 0, -Math.PI / 8]}>
        <meshStandardMaterial color="#8B4513" />
      </Cylinder>
    </group>
  );
}

function HomerBody() {
  return (
    <group position={[0, -1, 0]}>
      {/* Body */}
      <Sphere args={[0.8, 16, 16]} position={[0, 0, 0]} scale={[1, 1.3, 1]}>
        <meshStandardMaterial color="#87CEEB" />
      </Sphere>
      
      {/* Arms */}
      <Cylinder args={[0.15, 0.15, 0.8]} position={[-0.9, 0.2, 0]} rotation={[0, 0, Math.PI / 3]}>
        <meshStandardMaterial color="#FFD700" />
      </Cylinder>
      <Cylinder args={[0.15, 0.15, 0.8]} position={[0.9, 0.2, 0]} rotation={[0, 0, -Math.PI / 3]}>
        <meshStandardMaterial color="#FFD700" />
      </Cylinder>
      
      {/* Legs */}
      <Cylinder args={[0.2, 0.2, 0.8]} position={[-0.3, -0.9, 0]}>
        <meshStandardMaterial color="#4169E1" />
      </Cylinder>
      <Cylinder args={[0.2, 0.2, 0.8]} position={[0.3, -0.9, 0]}>
        <meshStandardMaterial color="#4169E1" />
      </Cylinder>
      
      {/* Feet */}
      <Box args={[0.3, 0.1, 0.4]} position={[-0.3, -1.4, 0.1]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      <Box args={[0.3, 0.1, 0.4]} position={[0.3, -1.4, 0.1]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
    </group>
  );
}

function DonutProp({ position }: { position: [number, number, number] }) {
  const donutRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (donutRef.current) {
      donutRef.current.rotation.y = state.clock.elapsedTime;
      donutRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <group ref={donutRef} position={position}>
      <Sphere args={[0.2, 16, 16]} scale={[1, 1, 0.5]}>
        <meshStandardMaterial color="#D2691E" />
      </Sphere>
      <Sphere args={[0.1, 16, 16]} scale={[1, 1, 0.5]}>
        <meshStandardMaterial color="#FFB6C1" />
      </Sphere>
    </group>
  );
}

function SpeechBubble({ text, visible }: { text: string; visible: boolean }) {
  if (!visible) return null;
  
  return (
    <group position={[2, 2, 0]}>
      <Box args={[1.5, 0.8, 0.1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="white" />
      </Box>
      <Text 
        position={[0, 0, 0.1]} 
        fontSize={0.15} 
        color="black" 
        anchorX="center" 
        anchorY="middle"
        maxWidth={1.3}
      >
        {text}
      </Text>
    </group>
  );
}

const homerQuotes = [
  "D'oh!",
  "Mmm... donuts",
  "I'll make your video awesome!",
  "Woo-hoo!",
  "That's perfect, dude!",
  "Let's make this legendary!"
];

interface HomerSimpson3DProps {
  onInteract?: () => void;
}

export default function HomerSimpson3D({ onInteract }: HomerSimpson3DProps) {
  const [currentQuote, setCurrentQuote] = useState('');
  const [showSpeech, setShowSpeech] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    const randomQuote = homerQuotes[Math.floor(Math.random() * homerQuotes.length)];
    setCurrentQuote(randomQuote);
    setShowSpeech(true);
    setIsAnimating(true);
    
    setTimeout(() => {
      setShowSpeech(false);
      setIsAnimating(false);
    }, 2000);
    
    onInteract?.();
  };

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [3, 2, 5], fov: 50 }}>
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[0, 5, 0]} intensity={0.5} />
        
        {/* Homer Simpson Character */}
        <HomerHead onClick={handleClick} isAnimating={isAnimating} />
        <HomerBody />
        
        {/* Floating Donuts */}
        <DonutProp position={[-2, 1, -1]} />
        <DonutProp position={[2.5, -0.5, 1]} />
        
        {/* Speech Bubble */}
        <SpeechBubble text={currentQuote} visible={showSpeech} />
        
        {/* Ground */}
        <Box args={[10, 0.1, 10]} position={[0, -2.5, 0]}>
          <meshStandardMaterial color="#90EE90" />
        </Box>
        
        {/* Controls */}
        <OrbitControls 
          enablePan={false} 
          minDistance={3} 
          maxDistance={8}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
