import React, { useContext, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { softShadows } from '@react-three/drei';
import './Scene.scss';
import SceneDefaults from '../SceneDefaults/SceneDefaults';
import MainContext from '../../context/MainContext';
import usePatch from '../../hooks/usePatch';
import ObjectModel from '../ObjectModel/ObjectModel';

softShadows();

export default function Scene() {
  const [threeState, setThreeState] = useState({});
  const [isOrbit, setIsOrbit] = useState(true);
  const { getCanvas } = useContext(MainContext);
  const { onMouseEvent } = usePatch(threeState);

  const onMouseEvt = (e, canvas) => {
    e.preventDefault();
    onMouseEvent(e, canvas);
  };
  useEffect(() => {
    setIsOrbit(getCanvas()?.getActiveObject());
  });

  return (
    <div className='scene'>
      <p className='scene__title'>Canvas</p>
      <div className='scene__canvas'>
        <Canvas
          id='lol'
          onMouseDown={(e) => onMouseEvt(e, getCanvas())}
          shadows
          linear
          camera={{ position: [0, 0, 5], fov: 5 }}>
          <SceneDefaults isOrbit={isOrbit} setState={setThreeState}>
            <ObjectModel position={[0, -0.5, 0]} canvas={getCanvas()?.getElement()} />
          </SceneDefaults>
        </Canvas>
      </div>
    </div>
  );
}
