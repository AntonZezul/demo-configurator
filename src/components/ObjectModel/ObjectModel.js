import { useEffect } from 'react';
import { CanvasTexture } from 'three';
import { useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

const ObjectModel = ({ position, canvas }) => {
  let obj = useLoader(OBJLoader, '/assets/models/model.obj');
  const colorMap = new CanvasTexture(canvas);

  useEffect(() => {
    obj.traverse((node) => {
      if (node.isMesh) {
        node.material.forEach((element) => (element.map = colorMap));
        node.geometry.needsUpdate = true;
        node.geometry.uvsNeedUpdate = true;
      }
    });
  });
  return <primitive object={obj} position={position} scale={0.4} />;
};

export default ObjectModel;
