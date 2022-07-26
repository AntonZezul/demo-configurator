import { a } from '@react-spring/three';
import { Suspense, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { CanvasTexture, Mesh, MeshPhongMaterial, ObjectLoader } from 'three';
import { useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { useTexture } from '@react-three/drei';
import MainContext from '../../context/MainContext';

const ObjectModel = ({ position, color = 'lightblue', args = [1, 1, 1], rotation, canvas }) => {
  const mesh = useRef(null);
  const defaultTexture = useTexture('assets/textures/texture.svg');
  const colorMap = new CanvasTexture(canvas);
  let obj = useLoader(OBJLoader, '/assets/models/model.obj');

  useEffect(() => {
    obj.traverse((node) => {
      if (node.isMesh) {
        node.material.forEach((element) => (element.map = colorMap));
        node.geometry.needsUpdate = true;
        node.geometry.uvsNeedUpdate = true;
      }
    });
  }, [colorMap, obj]);
  // return (
  //   <a.mesh color={color} geometry={geometry} position={position} scale={0.4}>
  //     <meshPhysicalMaterial map={colorMap} />
  //   </a.mesh>
  // );
  return <primitive object={obj} position={position} scale={0.4} />;
};

export default ObjectModel;
