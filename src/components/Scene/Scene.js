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

  // fabric.Canvas.prototype.getPointer = function (e, ignoreZoom) {
  //   // if (this._absolutePointer && !ignoreZoom) {
  //   //   return this._absolutePointer;
  //   // }
  //   // if (this._pointer && ignoreZoom) {
  //   //   return this._pointer;
  //   // }
  //   // var simEvt;
  //   // if (e.touches != undefined) {
  //   //   simEvt = new MouseEvent(
  //   //     {
  //   //       touchstart: 'mousedown',
  //   //       touchmove: 'mousemove',
  //   //       touchend: 'mouseup',
  //   //     }[e.type],
  //   //     {
  //   //       bubbles: true,
  //   //       cancelable: true,
  //   //       view: window,
  //   //       detail: 1,
  //   //       screenX: Math.round(e.changedTouches[0].screenX),
  //   //       screenY: Math.round(e.changedTouches[0].screenY),
  //   //       clientX: Math.round(e.changedTouches[0].clientX),
  //   //       clientY: Math.round(e.changedTouches[0].clientY),
  //   //       ctrlKey: false,
  //   //       altKey: false,
  //   //       shiftKey: false,
  //   //       metaKey: false,
  //   //       button: 0,
  //   //       relatedTarget: null,
  //   //     }
  //   //   );

  //   //   let pointerF = fabric.util.getPointer(simEvt),
  //   //     upperCanvasEl = this.upperCanvasEl,
  //   //     bounds = upperCanvasEl.getBoundingClientRect(),
  //   //     boundsWidth = bounds.width || 0,
  //   //     boundsHeight = bounds.height || 0,
  //   //     cssScale;
  //   // } else {
  //   //   let pointer = fabric.util.getPointer(e),
  //   //     upperCanvasEl = this.upperCanvasEl,
  //   //     bounds = upperCanvasEl.getBoundingClientRect(),
  //   //     boundsWidth = bounds.width || 0,
  //   //     boundsHeight = bounds.height || 0,
  //   //     cssScale;
  //   // }
  //   // if (!boundsWidth || !boundsHeight) {
  //   //   if ('top' in bounds && 'bottom' in bounds) {
  //   //     boundsHeight = Math.abs(bounds.top - bounds.bottom);
  //   //   }
  //   //   if ('right' in bounds && 'left' in bounds) {
  //   //     boundsWidth = Math.abs(bounds.right - bounds.left);
  //   //   }
  //   // }
  //   // this.calcOffset();
  //   // pointerF.x = pointerF.x - this._offset.left;
  //   // pointerF.y = pointerF.y - this._offset.top;
  //   // // /* BEGIN PATCH CODE */
  //   // if (e.target !== this.upperCanvasEl) {
  //   //   var positionOnScene;

  //   //   positionOnScene = getPositionOnScene(e);
  //   //   if (isMobile == true) {
  //   //     positionOnScene = getPositionOnSceneTouch(container, e);
  //   //     if (positionOnScene) {
  //   //       console.log(positionOnScene);
  //   //       pointerF.x = positionOnScene.x;
  //   //       pointerF.y = positionOnScene.y;
  //   //     }
  //   //   } else {
  //   //     positionOnScene = getPositionOnScene(container, e);
  //   //     if (positionOnScene) {
  //   //       console.log(positionOnScene);
  //   //       pointerF.x = positionOnScene.x;
  //   //       pointerF.y = positionOnScene.y;
  //   //     }
  //   //   }
  //   // }
  //   // if (!ignoreZoom) {
  //   //   pointerF = this.restorePointerVpt(pointerF);
  //   // }
  //   // if (boundsWidth === 0 || boundsHeight === 0) {
  //   //   cssScale = { width: 1, height: 1 };
  //   // } else {
  //   //   cssScale = {
  //   //     width: upperCanvasEl.width / boundsWidth,
  //   //     height: upperCanvasEl.height / boundsHeight,
  //   //   };
  //   // }
  //   const positionOnScene = getPositionOnScene(e);
  //   const canvasRect = this._offset;
  //   const simEvt = new MouseEvent(e.type, {
  //     clientX: canvasRect.left + positionOnScene.x,
  //     clientY: canvasRect.top + positionOnScene.y,
  //   });
  //   if (positionOnScene) {
  //     return {
  //       x: simEvt.clientX,
  //       // y: simEvt.clientY,
  //       // x: (pointer.x = pointer.x + this._offset.left),
  //       // y: (pointer.y = pointer.y + this._offset.top),
  //     };
  //   } else {
  //     return null;
  //   }
  // };

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

  const getPositionOnScene = (e) => {
    var array = getMousePosition(canvasState, e.clientX, e.clientY);
    pointer.fromArray(array);
    var intersects = getIntersects(pointer, scene.children);
    if (intersects.length > 0 && intersects[0].uv) {
      var uv = intersects[0].uv;
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
      // console.log(simEvt);
      // console.log(canvas.getPointer(e));

      canvas.upperCanvasEl.dispatchEvent(simEvt);
    }
  };

  const onMouseMove = (e, canvas) => {
    e.preventDefault();
    // const positionOnScene = getPositionOnScene(e);
    // pointer.x = canvas.getPointer(e).x;
    // pointer.y = canvas.getPointer(e).y;
    console.log(canvas.getPointer(e));

    // canvas?._onMouseMove(pointer);
    // if (positionOnScene) {
    //   const circle = new fabric.Circle({
    //     radius: 10,
    //     left: getRealPosition('x', positionOnScene.uv.x),
    //     top: getRealPosition('y', positionOnScene.uv.y),
    //     fill: 'red',
    //   });
    //   console.log(circle);
    //   canvas?.add(circle);
    // }
  };

  // const setActiveObject = (canvas, uv) => {
  //   const pointRect = (x, y) => ({ x: x / 512, y: y / 512 });
  //   const pointMouse = (x, y) => ({ x, y });
  //   const side = (a, b, p) => {
  //     return Math.sign((b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x));
  //   };
  //   const coords = canvas?._objects[0].aCoords;

  //   const A = pointRect(coords.tl.x, coords.tl.y);
  //   const B = pointRect(coords.tr.x, coords.tr.y);
  //   const C = pointRect(coords.br.x, coords.br.y);
  //   const D = pointRect(coords.bl.x, coords.bl.y);
  //   const E = pointMouse(uv.x, uv.y);

  //   const inArea = side(A, B, E) === 1 && side(B, C, E) === 1 && side(C, D, E) === 1 && side(D, A, E) === 1;

  //   inArea ? canvas.setActiveObject(canvas._objects[0]) : canvas.discardActiveObject();
  // };

  // const moveObject = (object, uv) => {
  //   if (object) {
  //     console.log(uv);
  //     object.left = uv.x * 512 - 50;
  //     object.top = uv.y * 512 - 50;
  //   }
  // };

  // const onMouseClick = (e, canvas) => {
  //   e.preventDefault();
  //   const array = getMousePosition(canvasState, e.clientX, e.clientY);
  //   pointer.fromArray(array);
  //   const intersects = getIntersects(pointer, scene.children);
  //   if (intersects.length > 0 && intersects[0].uv) {
  //     const uv = intersects[0].uv;
  //     intersects[0]?.object?.material?.map?.transformUv(uv);

  //     const circle = new fabric.Circle({
  //       radius: 0.1,
  //       left: getRealPosition('x', uv.x),
  //       top: getRealPosition('y', uv.y),
  //       fill: 'red',
  //     });
  //     canvas?.add(circle);
  //     canvas?.remove(circle);

  //     setActiveObject(canvas, uv);
  //   }
  // };

  // const onMouseMove = (e, canvas) => {
  //   e.preventDefault();
  //   const array = getMousePosition(canvasState, e.clientX, e.clientY);
  //   pointer.fromArray(array);
  //   const intersects = getIntersects(pointer, scene.children);
  //   if (intersects.length > 0 && intersects[0].uv) {
  //     const uv = intersects[0].uv;
  //     intersects[0]?.object?.material?.map?.transformUv(uv);

  //     moveObject(canvas?.getActiveObject(), uv);
  //   }
  // };
  useEffect(() => {
    setIsOrbit(getCanvas()?.getActiveObject());
  });

  return (
    <div className='scene'>
      <p className='scene__title'>Canvas</p>
      <div className='scene__canvas'>
        <Canvas
          onMouseDown={(e) => onMouseEvt(e, getCanvas())}
          onMouseMove={(e) => onMouseMove(e, getCanvas())}
          // onMouseUp={(e) => onMouseEvt(e, getCanvas())}
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
