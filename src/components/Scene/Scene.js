import React, { useContext, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { softShadows } from '@react-three/drei';
import './Scene.scss';
import SceneDefaults from '../SceneDefaults/SceneDefaults';
import Box from '../Box/Box';
import { fabric } from 'fabric';
import MainContext from '../../context/MainContext';

softShadows();

export default function Scene() {
  const [canvasState, setCanvasState] = useState('');
  const [threeState, setThreeState] = useState({});
  const { getCanvas } = useContext(MainContext);
  const { scene, camera, raycaster, mouse, pointer } = threeState;

  useEffect(() => {
    const canvas = document.querySelector('.scene__canvas');
    setCanvasState(canvas);
  }, []);

  const getMousePosition = (dom, x, y) => {
    const rect = dom.getBoundingClientRect();
    return [(x - rect.left) / rect.width, (y - rect.top) / rect.height];
  };

  const getRealPosition = (axis, value) => {
    const CORRECTION_VALUE = axis === 'x' ? 4.5 : 5.5;
    return Math.round(value * 512) - CORRECTION_VALUE;
  };

  const getIntersects = (point, objects) => {
    mouse.set(point.x * 2 - 1, -(point.y * 2) + 1);
    raycaster.setFromCamera(mouse, camera);
    return raycaster.intersectObjects(objects);
  };

  const setActiveObject = (canvas, uv) => {
    const pointRect = (x, y) => ({ x: x / 512, y: y / 512 });
    const pointMouse = (x, y) => ({ x, y });
    const side = (a, b, p) => {
      return Math.sign((b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x));
    };
    const coords = canvas?._objects[0].aCoords;

    const A = pointRect(coords.tl.x, coords.tl.y);
    const B = pointRect(coords.tr.x, coords.tr.y);
    const C = pointRect(coords.br.x, coords.br.y);
    const D = pointRect(coords.bl.x, coords.bl.y);
    const E = pointMouse(uv.x, uv.y);

    const inArea = side(A, B, E) === 1 && side(B, C, E) === 1 && side(C, D, E) === 1 && side(D, A, E) === 1;

    inArea ? canvas.setActiveObject(canvas._objects[0]) : canvas.discardActiveObject();
  };

  const onMouseClick = (e, canvas) => {
    e.preventDefault();
    const array = getMousePosition(canvasState, e.clientX, e.clientY);
    pointer.fromArray(array);
    const intersects = getIntersects(pointer, scene.children);
    if (intersects.length > 0 && intersects[0].uv) {
      const uv = intersects[0].uv;
      intersects[0]?.object?.material?.map?.transformUv(uv);

      const circle = new fabric.Circle({
        radius: 0.1,
        left: getRealPosition('x', uv.x),
        top: getRealPosition('y', uv.y),
        fill: 'red',
      });
      canvas?.add(circle);
      canvas?.remove(circle);

      console.log(intersects);
      setActiveObject(canvas, uv);
    }
  };

  return (
    <div className='scene'>
      <p className='scene__title'>Canvas</p>
      <div className='scene__canvas'>
        <Canvas
          onMouseDown={(e) => onMouseClick(e, getCanvas())}
          shadows
          linear
          camera={{ position: [-2, 2, 5], fov: 40 }}>
          <SceneDefaults setState={setThreeState}>
            {/* <Cylinder
              rotation={[-45, 90, 0]}
              position={[0, 0.5, 0]}
              color='pink'
              canvas={canvasState}
            /> */}
            <Box rotation={[0, 0, 0]} position={[0, 0.5, 0]} color='pink' canvas={getCanvas()?.getElement()} />
          </SceneDefaults>
        </Canvas>
      </div>
    </div>
  );
}
