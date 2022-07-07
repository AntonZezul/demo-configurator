import { a } from '@react-spring/three';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { CanvasTexture } from 'three';

const Box = ({ position, color = 'lightblue', args = [1, 1, 1], rotation, canvas }) => {
  const mesh = useRef(null);
  const colorMap = new CanvasTexture(canvas);

  useFrame(() => {
    colorMap.needsUpdate = true;
  });

  return (
    <a.mesh
      scale={[1, 1, 1]}
      // castShadow
      rotation={rotation}
      position={position}
      ref={mesh}>
      <boxBufferGeometry attach='geometry' args={args} />
      <meshStandardMaterial attach='material' color={color} map={colorMap} metalness={0.25} roughness={0.25} />
    </a.mesh>
  );
};

export default Box;
