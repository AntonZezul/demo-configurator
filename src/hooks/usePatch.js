import { fabric } from 'fabric';
import { useContext, useEffect, useState } from 'react';
import MainContext from '../context/MainContext';

export default function usePatch(threeState) {
  let isMobile = false;
  const { getCanvas } = useContext(MainContext);
  const [canvasState, setCanvasState] = useState('');

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
    threeState.mouse.set(point.x * 2 - 1, -(point.y * 2) + 1);
    threeState.raycaster.setFromCamera(threeState.mouse, threeState.camera);
    return threeState.raycaster.intersectObjects(objects);
  };

  const getPositionOnSceneTouch = (e) => {
    const array = getMousePosition(canvasState, e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    threeState.pointer.fromArray(array);
    const intersects = getIntersects(threeState.pointer, threeState.scene.children);
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
    threeState.pointer.fromArray(array);
    const intersects = getIntersects(threeState.pointer, threeState.scene.children);
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
      pointerF = this.restorePointerVpt(pointerF);
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
  return {
    getPositionOnScene,
  };
}
