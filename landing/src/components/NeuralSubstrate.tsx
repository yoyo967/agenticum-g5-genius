import { Canvas } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';

export const NeuralSubstrate = () => {
  return (
    <div className="fixed inset-0 z-0 bg-obsidian pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00e5ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ffd700" />
        
        <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
          <Sphere args={[1, 100, 100]} scale={2}>
            <MeshDistortMaterial
              color="#00e5ff"
              attach="material"
              distort={0.4}
              speed={2}
              roughness={0}
              metalness={0.8}
              transparent
              opacity={0.1}
            />
          </Sphere>
        </Float>

        <gridHelper args={[100, 50, '#1a1a1a', '#050505']} position={[0, -2, 0]} rotation={[Math.PI / 2, 0, 0]} />
        
        {/* Abstract Floating Data Particles */}
        {Array.from({ length: 50 }).map((_, i) => (
          <Float key={i} speed={Math.random() * 2} position={[
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 10
          ]}>
            <Sphere args={[0.02, 16, 16]}>
              <meshBasicMaterial color={i % 2 === 0 ? "#00e5ff" : "#ffd700"} transparent opacity={0.3} />
            </Sphere>
          </Float>
        ))}
      </Canvas>
    </div>
  );
};
