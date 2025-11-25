import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import * as THREE from 'three';

interface FirstPersonControlsProps {
    moveSpeed?: number;
    lookSpeed?: number;
}

const FirstPersonControls = ({ moveSpeed = 5, lookSpeed = 0.002 }: FirstPersonControlsProps) => {
    const { camera, gl } = useThree();
    const moveDirection = useRef(new Vector3());
    const velocity = useRef(new Vector3());
    const keysPressed = useRef<Set<string>>(new Set());
    const isPointerLocked = useRef(false);
    const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            keysPressed.current.add(event.code.toLowerCase());
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            keysPressed.current.delete(event.code.toLowerCase());
        };

        const handleMouseMove = (event: MouseEvent) => {
            if (!isPointerLocked.current) return;

            const movementX = event.movementX || 0;
            const movementY = event.movementY || 0;

            euler.current.setFromQuaternion(camera.quaternion);
            euler.current.y -= movementX * lookSpeed;
            euler.current.x -= movementY * lookSpeed;
            euler.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.current.x));
            camera.quaternion.setFromEuler(euler.current);
        };

        const handlePointerLockChange = () => {
            isPointerLocked.current = document.pointerLockElement === gl.domElement;
        };

        const handleClick = () => {
            gl.domElement.requestPointerLock();
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('pointerlockchange', handlePointerLockChange);
        gl.domElement.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('pointerlockchange', handlePointerLockChange);
            gl.domElement.removeEventListener('click', handleClick);
        };
    }, [camera, gl, lookSpeed]);

    useFrame((state, delta) => {
        const keys = keysPressed.current;

        // Reset movement direction
        moveDirection.current.set(0, 0, 0);

        // Get camera direction
        const forward = new Vector3();
        camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();

        const right = new Vector3();
        right.crossVectors(forward, new Vector3(0, 1, 0)).normalize();

        // WASD movement
        if (keys.has('keyw')) moveDirection.current.add(forward);
        if (keys.has('keys')) moveDirection.current.sub(forward);
        if (keys.has('keya')) moveDirection.current.sub(right);
        if (keys.has('keyd')) moveDirection.current.add(right);

        // Normalize diagonal movement
        if (moveDirection.current.length() > 0) {
            moveDirection.current.normalize();
        }

        // Apply movement with smooth damping
        const targetVelocity = moveDirection.current.clone().multiplyScalar(moveSpeed);
        velocity.current.lerp(targetVelocity, delta * 10);

        // Update camera position
        camera.position.addScaledVector(velocity.current, delta);

        // Keep camera above ground
        camera.position.y = Math.max(1.6, camera.position.y);
    });

    return null;
};

export default FirstPersonControls;
