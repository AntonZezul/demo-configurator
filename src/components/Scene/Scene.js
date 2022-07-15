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
  const [isOrbit, setIsOrbit] = useState(true);
  const { getCanvas } = useContext(MainContext);
  let { scene, camera, raycaster, mouse, pointer } = threeState;
  let isMobile = false;

  fabric.Canvas.prototype.getPointer = function (e, ignoreZoom) {
    if (this._absolutePointer && !ignoreZoom) {
      return this._absolutePointer;
    }
    if (this._pointer && ignoreZoom) {
      return this._pointer;
    }
    let pointerF, cssScale;
    const bounds = getCanvas();
    let boundsWidth = bounds.width || 0;
    let boundsHeight = bounds.height || 0;
    let simEvt;
    if (e.touches !== undefined) {
      simEvt = new MouseEvent(
        {
          touchstart: 'mousedown',
          touchmove: 'mousemove',
          touchend: 'mouseup',
        }[e.type],
        {
          bubbles: true,
          cancelable: true,
          view: window,
          detail: 1,
          screenX: Math.round(e.changedTouches[0].screenX),
          screenY: Math.round(e.changedTouches[0].screenY),
          clientX: Math.round(e.changedTouches[0].clientX),
          clientY: Math.round(e.changedTouches[0].clientY),
          ctrlKey: false,
          altKey: false,
          shiftKey: false,
          metaKey: false,
          button: 0,
          relatedTarget: null,
        }
      );
      pointerF = fabric.util.getPointer(simEvt);
    } else {
      pointerF = fabric.util.getPointer(e);
    }
    if (!boundsWidth || !boundsHeight) {
      if ('top' in bounds && 'bottom' in bounds) {
        boundsHeight = Math.abs(bounds.top - bounds.bottom);
      }
      if ('right' in bounds && 'left' in bounds) {
        boundsWidth = Math.abs(bounds.right - bounds.left);
      }
    }
    this.calcOffset();
    pointerF.x = pointerF.x - this._offset.left;
    pointerF.y = pointerF.y - this._offset.top;
    if (e.target !== this.upperCanvasEl) {
      let positionOnScene;
      if (isMobile === true) {
        positionOnScene = getPositionOnSceneTouch(e);
        if (positionOnScene) {
          console.log(positionOnScene);
          pointerF.x = positionOnScene.x;
          pointerF.y = positionOnScene.y;
        }
      } else {
        positionOnScene = getPositionOnScene(e);
        if (positionOnScene) {
          pointerF.x = positionOnScene.x;
          pointerF.y = positionOnScene.y;
        }
      }
    }
    if (!ignoreZoom) {
      pointerF = this.restorePointerVpt(pointer);
    }
    if (boundsWidth === 0 || boundsHeight === 0) {
      cssScale = { width: 1, height: 1 };
    } else {
      cssScale = {
        width: getCanvas().width / boundsWidth,
        height: getCanvas().height / boundsHeight,
      };
    }
    return {
      x: pointerF.x * cssScale.width,
      y: pointerF.y * cssScale.height,
    };
  };

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

  const getPositionOnSceneTouch = (e) => {
    const array = getMousePosition(canvasState, e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    pointer.fromArray(array);
    const intersects = getIntersects(pointer, scene.children);
    if (intersects.length > 0 && intersects[0].uv) {
      const uv = intersects[0].uv;
      intersects[0].object.material.map.transformUv(uv);
      return {
        x: getRealPosition('x', uv.x),
        y: getRealPosition('y', uv.y),
        uv,
      };
    }
    return null;
  };

  const getPositionOnScene = (e) => {
    const array = getMousePosition(canvasState, e.clientX, e.clientY);
    pointer.fromArray(array);
    const intersects = getIntersects(pointer, scene.children);
    if (intersects.length > 0 && intersects[0].uv) {
      const uv = intersects[0].uv;
      intersects[0].object.material.map.transformUv(uv);
      return {
        x: getRealPosition('x', uv.x),
        y: getRealPosition('y', uv.y),
        uv,
      };
    }
    return null;
  };
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
