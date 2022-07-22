import { a } from '@react-spring/three';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { CanvasTexture, Mesh, MeshPhongMaterial, ObjectLoader } from 'three';
import { useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { useTexture } from '@react-three/drei';

const ObjectModel = ({ position, color = 'lightblue', args = [1, 1, 1], rotation, canvas }) => {
  const mesh = useRef(null);
  const colorMap = new CanvasTexture(canvas);
  const defaultTexture = useTexture('assets/textures/texture.svg');
  let obj = useLoader(OBJLoader, '/assets/models/model.obj');

  useEffect(() => {
    // if (obj.children) {
    //   obj.children[0].material[0].map = colorMap;
    // }
    obj.traverse((node) => {
      if (node.isMesh) {
        node.material.forEach((element) => (element.map = defaultTexture));
        node.material[1].map = defaultTexture;
        node.geometry.uvsNeedUpdate = true;
      }
    });
  }, [obj.children]);

  // return (
  //   <a.mesh color={color} geometry={geometry} position={position} scale={0.4}>
  //     <meshPhysicalMaterial map={colorMap} />
  //   </a.mesh>
  // );
  return <primitive object={obj} position={position} scale={0.4} />;
};

export default ObjectModel;
