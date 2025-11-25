import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import ProductPedestal from './ProductPedestal';
import VaultEnvironment from './VaultEnvironment';
import FirstPersonControls from './FirstPersonControls';
import { useNavigate } from 'react-router-dom';

interface Product {
    id: string;
    brand: string;
    model: string;
    warranty_expiry?: string;
}

interface ProductVault3DProps {
    products: Product[];
}

const ProductVault3D = ({ products }: ProductVault3DProps) => {
    const navigate = useNavigate();
    const [dpr, setDpr] = useState(1.5);

    // Arrange products in a circular pattern
    const getProductPosition = (index: number, total: number): [number, number, number] => {
        const radius = Math.max(8, total * 0.8); // Adjust radius based on product count
        const angle = (index / total) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return [x, 0, z];
    };

    const handleProductClick = (productId: string) => {
        // Exit pointer lock before navigation
        if (document.pointerLockElement) {
            document.exitPointerLock();
        }
        navigate(`/products/${productId}`);
    };

    return (
        <div className="w-full h-screen bg-black">
            {/* Instructions Overlay */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-black/80 backdrop-blur-sm px-6 py-3 rounded-lg border border-emerald-500/30">
                <p className="text-emerald-400 text-sm font-mono text-center">
                    <span className="font-bold">CLICK</span> to enter vault • <span className="font-bold">WASD</span> to move • <span className="font-bold">MOUSE</span> to look • <span className="font-bold">CLICK PRODUCT</span> to view
                </p>
            </div>

            {/* Performance Stats (optional) */}
            <div className="absolute bottom-4 right-4 z-10 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-emerald-500/30">
                <p className="text-emerald-400 text-xs font-mono">
                    Products: {products.length} | FPS: {dpr === 1.5 ? 'HIGH' : 'LOW'}
                </p>
            </div>

            <Canvas
                camera={{
                    position: [0, 1.6, 0],
                    fov: 75,
                    near: 0.1,
                    far: 1000,
                }}
                dpr={dpr}
                gl={{
                    antialias: true,
                    alpha: false,
                    powerPreference: 'high-performance',
                }}
            >
                <PerformanceMonitor
                    onIncline={() => setDpr(1.5)}
                    onDecline={() => setDpr(1)}
                >
                    <Suspense fallback={null}>
                        {/* Environment */}
                        <VaultEnvironment />

                        {/* Products on Pedestals */}
                        {products.map((product, index) => (
                            <ProductPedestal
                                key={product.id}
                                position={getProductPosition(index, products.length)}
                                product={product}
                                onClick={() => handleProductClick(product.id)}
                                onHover={(hovered) => {
                                    document.body.style.cursor = hovered ? 'pointer' : 'default';
                                }}
                            />
                        ))}

                        {/* First Person Controls */}
                        <FirstPersonControls moveSpeed={5} lookSpeed={0.002} />
                    </Suspense>
                </PerformanceMonitor>
            </Canvas>
        </div>
    );
};

export default ProductVault3D;
