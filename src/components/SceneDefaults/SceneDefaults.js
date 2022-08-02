import { OrbitControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import React, { Suspense, useEffect, useState } from 'react';

export default function SceneDefaults({ children, setState, isOrbit }) {
  const { scene, camera, raycaster, mouse, pointer } = useThree();
  const [threeState, setThreeState] = useState({});

  useEffect(() => {
    setThreeState({
      scene,
      camera,
      raycaster,
      mouse,
      pointer,
    });
    setState(threeState);
  }, [camera, mouse, pointer, raycaster, scene, setState, threeState]);

  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[0, 10, 0]} intensity={1.5} />
      <pointLight position={[-10, 0, -20]} intensity={0.5} />
      <pointLight position={[0, -10, 0]} intensity={1.5} />
      <pointLight position={[-3, 0, 2]} intensity={1.5} />

      <group>{children}</group>
      {!isOrbit && <OrbitControls minDistance={3} maxDistance={5} />}
    </Suspense>
  );
}
