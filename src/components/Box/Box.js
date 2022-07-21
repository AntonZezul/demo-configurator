import { a } from '@react-spring/three';
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { BackSide, CanvasTexture, DoubleSide } from 'three';

const Box = ({ position, color = 'lightblue', args = [1, 1, 1], rotation, canvas, onMouseMove }) => {
  const mesh = useRef(null);
  const defaultColor = '#777';
  const colorMap = new CanvasTexture(canvas);
  const defaultTexture = useTexture('images/exterior-1.jpg');
  const [face, setFace] = useState(1);
  const mapArr = [
    { id: 0, active: false },
    { id: 1, active: true },
    { id: 2, active: false },
    { id: 3, active: false },
    { id: 4, active: false },
    { id: 5, active: false },
  ];

  useFrame(() => {
    colorMap.needsUpdate = true;
  });

  useEffect(() => {
    mapArr.forEach((item) => (item.active = false));
    mapArr[face].active = true;
    console.log(mapArr);
  }, [face]);

  return (
    <a.mesh
      onPointerMove={(e) => setFace(onMouseMove(e))}
      scale={[1, 1, 1]}
      // castShadow
      rotation={rotation}
      position={position}
      ref={mesh}>
      <boxBufferGeometry attach='geometry' args={args} />
      {mapArr.map((texture) => (
        <meshStandardMaterial
          key={texture.id}
          attach={`material-${texture.id}`}
          name={texture.id}
          color={texture.id === face ? color : defaultColor}
          map={texture.id === face ? colorMap : null}
          metalness={0.25}
          roughness={0.25}
          // visible={texture.id === face}
        />
      ))}
      {/* <meshStandardMaterial
        attach='material-0'
        name='0'
        // color={color}
        // map={colorMap}
        metalness={0.25}
        roughness={0.25}
      />
      <meshStandardMaterial
        attach='material-1'
        name='1'
        color={color}
        map={colorMap}
        metalness={0.25}
        roughness={0.25}
      />
      <meshStandardMaterial
        attach='material-2'
        name='2'
        // color={color}
        // map={colorMap}
        metalness={0.25}
        roughness={0.25}
      />
      <meshStandardMaterial
        attach='material-3'
        name='3'
        // color={color}
        // map={colorMap}
        metalness={0.25}
        roughness={0.25}
      />
      <meshStandardMaterial
        attach='material-4'
        name='4'
        // color={color}
        // map={colorMap}
        metalness={0.25}
        roughness={0.25}
      />
      <meshStandardMaterial
        attach='material-5'
        name='5'
        // color={color}
        map={colorMap}
        metalness={0.25}
        roughness={0.25}
      /> */}
    </a.mesh>
  );
};

export default Box;
