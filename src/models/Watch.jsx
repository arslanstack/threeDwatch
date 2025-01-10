import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import WatchScene from './../assets/3d/digital_watch.glb';
import { a } from '@react-spring/three';

const Watch = ({ ...props }) => {
  const { nodes, materials } = useGLTF(WatchScene);
  const group = useRef();

  const rotationSpeed = 0.05; // Adjust rotation speed for manual control
  const idleRotationSpeed = 0.001; // Adjust rotation speed for idle rotation
  const keysPressed = useRef({ ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false });

  // Listen for keydown and keyup events
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (keysPressed.current[event.key] !== undefined) {
        keysPressed.current[event.key] = true;
      }
    };

    const handleKeyUp = (event) => {
      if (keysPressed.current[event.key] !== undefined) {
        keysPressed.current[event.key] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Rotate the model based on key presses or idle rotation
  useFrame(() => {
    if (group.current) {
      const rotation = group.current.rotation;

      // Manual rotation
      if (keysPressed.current.ArrowUp) rotation.x -= rotationSpeed;
      if (keysPressed.current.ArrowDown) rotation.x += rotationSpeed;
      if (keysPressed.current.ArrowLeft) rotation.y -= rotationSpeed;
      if (keysPressed.current.ArrowRight) rotation.y += rotationSpeed;

      // Idle rotation if no keys are pressed
      const isIdle = !Object.values(keysPressed.current).some((pressed) => pressed);
      if (isIdle) {
        rotation.x += idleRotationSpeed; // Slow rotation on the x-axis
        rotation.y += idleRotationSpeed; // Slow rotation on the y-axis (diagonal effect)
      }
    }
  });

  return (
    <a.group ref={group} {...props} dispose={null}>
      <group scale={0.01}>
        <group position={[0.1, 0.035, 2.353]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Case_Face_0.geometry}
            material={materials.Face}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Case_Case_0.geometry}
            material={materials.Case}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Glass_Glass_0.geometry}
            material={materials.Glass}
            position={[-0.002, -0.006, 0]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Band_Band_0.geometry}
            material={materials.Band}
            position={[-0.002, 0.029, 0]}
          />
        </group>
      </group>
    </a.group>
  );
};

useGLTF.preload(WatchScene);
export default Watch;
