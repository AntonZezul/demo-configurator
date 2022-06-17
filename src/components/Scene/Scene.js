import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { softShadows, OrbitControls } from '@react-three/drei';
import { a, useSpring } from '@react-spring/three';
import './Scene.scss';
import { CanvasTexture } from 'three';

softShadows();

const Mesh = ({
  position,
  color = 'lightblue',
  args = [0.5, 0.5, 2, 32],
  rotation,
  canvas,
}) => {
  const mesh = useRef(null);
  const colorMap = new CanvasTexture(canvas);
  const [expand, setExpand] = useState(false);
  const props = useSpring({
    scale: expand ? [1.4, 1.4, 1.4] : [1, 1, 1],
  });
  useFrame(() => {
    colorMap.needsUpdate = true
    // mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
  });

  console.log(canvas)
  return (
    <a.mesh
      onClick={() => setExpand((prev) => !prev)}
      scale={props.scale}
      castShadow
      rotation={rotation}
      position={position}
      ref={mesh}>
      <cylinderBufferGeometry attach='geometry' args={args} />
      <meshStandardMaterial attach='material' color={color} map={colorMap} />
    </a.mesh>
  );
};

export default function Scene() {
  const [canvasState, setCanvasState] = useState('');
  useEffect(() => {
    const canvas = document.querySelector('#canvas');
    setCanvasState(canvas);
  }, []);

  return (
    <div className='scene'>
      <p className='scene__title'>Canvas</p>
      <div className='scene__canvas'>
        <Canvas shadows linear camera={{ position: [-2, 2, 10], fov: 50 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.3} />
            <directionalLight
              castShadow
              position={[0, 10, 0]}
              intensity={1.5}
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              shadow-camera-far={50}
              shadow-camera-left={-10}
              shadow-camera-right={10}
              shadow-camera-top={10}
              shadow-camera-bottom={-10}
            />
            <pointLight position={[-10, 0, -20]} intensity={0.5} />
            <pointLight position={[0, -10, 0]} intensity={1.5} />

            <group>
              <mesh
                receiveShadow
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -3, 0]}>
                <planeBufferGeometry attach='geometry' args={[100, 100]} />
                <shadowMaterial attach='material' opacity={0.3} />
              </mesh>
              <Mesh
                rotation={[-45, 90, 0]}
                position={[0, 1, 0]}
                color='white'
                canvas={canvasState}
              />
            </group>
            <OrbitControls />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
