import { useRef } from 'react';
import { Mesh } from 'three';
import { useFrame } from '@react-three/fiber';
import { Grid, Stars } from '@react-three/drei';

const VaultEnvironment = () => {
    const fogRef = useRef<Mesh>(null);

    useFrame((state) => {
        if (fogRef.current) {
            fogRef.current.rotation.y = state.clock.elapsedTime * 0.05;
        }
    });

    return (
        <>
            {/* Ambient Lighting */}
            <ambientLight intensity={0.2} />

            {/* Main Directional Light */}
            <directionalLight
                position={[10, 20, 10]}
                intensity={0.5}
                castShadow
            />

            {/* Rim Light */}
            <directionalLight
                position={[-10, 10, -10]}
                intensity={0.3}
                color="#00ffaa"
            />

            {/* Cyber Grid Floor */}
            <Grid
                position={[0, -0.01, 0]}
                args={[100, 100]}
                cellSize={2}
                cellThickness={0.5}
                cellColor="#00cc66"
                sectionSize={10}
                sectionThickness={1}
                sectionColor="#00ffaa"
                fadeDistance={50}
                fadeStrength={1}
                infiniteGrid
            />

            {/* Floor Plane (receives shadows) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial
                    color="#0a0a0f"
                    metalness={0.8}
                    roughness={0.2}
                />
            </mesh>

            {/* Starfield Background */}
            <Stars
                radius={100}
                depth={50}
                count={5000}
                factor={4}
                saturation={0}
                fade
                speed={0.5}
            />

            {/* Atmospheric Fog Sphere */}
            <mesh ref={fogRef}>
                <sphereGeometry args={[50, 32, 32]} />
                <meshBasicMaterial
                    color="#00cc66"
                    transparent
                    opacity={0.03}
                    wireframe
                />
            </mesh>

            {/* Fog */}
            <fog attach="fog" args={['#000000', 10, 50]} />

            {/* Accent Lights - Pillars of light */}
            {[0, 90, 180, 270].map((angle) => {
                const rad = (angle * Math.PI) / 180;
                const x = Math.cos(rad) * 20;
                const z = Math.sin(rad) * 20;
                return (
                    <group key={angle} position={[x, 0, z]}>
                        <pointLight
                            color="#00ffaa"
                            intensity={1}
                            distance={15}
                            decay={2}
                        />
                        <mesh position={[0, 5, 0]}>
                            <cylinderGeometry args={[0.1, 0.5, 10, 8, 1, true]} />
                            <meshBasicMaterial
                                color="#00cc66"
                                transparent
                                opacity={0.2}
                                side={2}
                            />
                        </mesh>
                    </group>
                );
            })}
        </>
    );
};

export default VaultEnvironment;
