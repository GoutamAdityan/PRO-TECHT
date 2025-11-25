import { useRef } from 'react';
import { Mesh } from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

interface ProductPedestalProps {
    position: [number, number, number];
    product: {
        id: string;
        brand: string;
        model: string;
        warranty_expiry?: string;
    };
    onClick: () => void;
    onHover: (hovered: boolean) => void;
}

const ProductPedestal = ({ position, product, onClick, onHover }: ProductPedestalProps) => {
    const meshRef = useRef<Mesh>(null);
    const glowRef = useRef<Mesh>(null);

    // Determine glow color based on warranty status
    const getStatusColor = () => {
        if (!product.warranty_expiry) return '#00cc66'; // green

        const now = new Date();
        const expiry = new Date(product.warranty_expiry);
        const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (daysUntilExpiry < 0) return '#ff4444'; // red - expired
        if (daysUntilExpiry <= 30) return '#ffaa00'; // yellow - expiring soon
        return '#00cc66'; // green - active
    };

    const statusColor = getStatusColor();

    // Gentle rotation animation
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
        if (glowRef.current) {
            // Pulsing glow effect
            const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.2 + 0.8;
            glowRef.current.scale.setScalar(pulse);
        }
    });

    return (
        <group position={position}>
            {/* Base Pedestal */}
            <mesh
                ref={meshRef}
                position={[0, 0.5, 0]}
                onClick={onClick}
                onPointerOver={() => onHover(true)}
                onPointerOut={() => onHover(false)}
            >
                <cylinderGeometry args={[0.8, 1, 1, 6]} />
                <meshStandardMaterial
                    color="#1a1a2e"
                    metalness={0.8}
                    roughness={0.2}
                    emissive={statusColor}
                    emissiveIntensity={0.3}
                />
            </mesh>

            {/* Glowing Ring */}
            <mesh ref={glowRef} position={[0, 1.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.85, 0.05, 16, 32]} />
                <meshStandardMaterial
                    color={statusColor}
                    emissive={statusColor}
                    emissiveIntensity={2}
                    toneMapped={false}
                />
            </mesh>

            {/* Product Info Card */}
            <group position={[0, 2, 0]}>
                {/* Background Card */}
                <mesh>
                    <planeGeometry args={[2, 1]} />
                    <meshStandardMaterial
                        color="#0a0a0f"
                        transparent
                        opacity={0.9}
                        metalness={0.5}
                        roughness={0.5}
                    />
                </mesh>

                {/* Product Name */}
                <Text
                    position={[0, 0.2, 0.01]}
                    fontSize={0.15}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={1.8}
                >
                    {product.brand}
                </Text>

                {/* Product Model */}
                <Text
                    position={[0, 0, 0.01]}
                    fontSize={0.12}
                    color="#aaaaaa"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={1.8}
                >
                    {product.model}
                </Text>

                {/* Status Indicator */}
                <mesh position={[0, -0.25, 0.01]}>
                    <circleGeometry args={[0.08, 32]} />
                    <meshBasicMaterial color={statusColor} />
                </mesh>
            </group>

            {/* Vertical Light Beam */}
            <mesh position={[0, 5, 0]}>
                <cylinderGeometry args={[0.05, 0.3, 10, 8, 1, true]} />
                <meshBasicMaterial
                    color={statusColor}
                    transparent
                    opacity={0.15}
                    side={2}
                />
            </mesh>

            {/* Point Light */}
            <pointLight
                position={[0, 1.5, 0]}
                color={statusColor}
                intensity={2}
                distance={5}
                decay={2}
            />
        </group>
    );
};

export default ProductPedestal;
