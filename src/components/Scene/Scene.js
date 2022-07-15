import React, { useContext, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { softShadows } from '@react-three/drei';
import './Scene.scss';
import SceneDefaults from '../SceneDefaults/SceneDefaults';
import Box from '../Box/Box';
import MainContext from '../../context/MainContext';
import usePatch from '../../hooks/usePatch';

softShadows();

export default function Scene() {
  const [threeState, setThreeState] = useState({});
  const [isOrbit, setIsOrbit] = useState(true);
  const { getCanvas } = useContext(MainContext);
  const { getPositionOnScene } = usePatch(threeState);

  const onMouseEvt = (e, canvas) => {
    e.preventDefault();
    const positionOnScene = getPositionOnScene(e);
    if (positionOnScene) {
      const canvasRect = canvas._offset;
      const simEvt = new MouseEvent(e.type, {
        clientX: canvasRect.left + positionOnScene.x,
        clientY: canvasRect.top + positionOnScene.y,
      });
      canvas.upperCanvasEl.dispatchEvent(simEvt);
    }
  };

  useEffect(() => {
    setIsOrbit(getCanvas()?.getActiveObject());
  });

  return (
    <div className='scene'>
      <p className='scene__title'>Canvas</p>
      <div className='scene__canvas'>
        <Canvas
          onMouseDown={(e) => onMouseEvt(e, getCanvas())}
          shadows
          linear
          camera={{ position: [-2, 2, 5], fov: 40 }}>
          <SceneDefaults isOrbit={isOrbit} setState={setThreeState}>
            <Box rotation={[0, 0, 0]} position={[0, 0.5, 0]} color='pink' canvas={getCanvas()?.getElement()} />
          </SceneDefaults>
        </Canvas>
      </div>
    </div>
  );
}
