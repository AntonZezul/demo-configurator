import React, { useEffect, useState, useContext } from 'react';
import { fabric } from 'fabric';
import './Editor.scss';
import MainContext from '../../context/MainContext';

export default function Editor() {
  const [imgURL, setImgURL] = useState('');
  const { setCanvas, getCanvas } = useContext(MainContext);

  const initCanvas = () => {
    return new fabric.Canvas('canvas', {
      height: 1024,
      width: 1024,
      backgroundColor: 'pink',
      selection: false,
    });
  };

  const addText = (canvi) => {
    const text = new fabric.IText('Three.js\n', {
      fontSize: 40,
      textAlign: 'center',
      fontWeight: 'bold',
      left: 128,
      top: 128,
      originX: 'center',
      originY: 'center',
      shadow: 'blue -5px 6px 5px',
    });
    canvi.add(text);
  };

  const addRect = (canvi) => {
    const rect = new fabric.Rect({
      top: 850,
      left: 580,
      fill: '#FF6E27',
      width: 50,
      height: 50,
      transparentCorners: false,
      centeredScaling: true,
      borderColor: 'black',
      cornerColor: 'black',
      corcerStrokeColor: 'black',
    });
    canvi.add(rect);
    canvi.renderAll();
  };

  const addImg = (canvi, imgElement) => {
    const imgInstance = new fabric.Image(imgElement, {
      left: 0,
      top: 0,
      selectable: false,
    });
    canvi.add(imgInstance);
  };

  useEffect(() => {
    const svgImage = new Image();
    svgImage.src = '/assets/textures/texture.svg';
    setCanvas((prev) => (!prev ? initCanvas() : prev));
    svgImage.onload = () => {
      getCanvas() && addImg(getCanvas(), svgImage);
      getCanvas() && addRect(getCanvas());
    };
  }, [getCanvas, setCanvas]);

  return (
    <div className='editor'>
      <p className='editor__title'>Edit shape</p>
      <div className='editor__workspace'>
        <canvas id='canvas' />
      </div>
      <div className='editor__actions'>
        <button onClick={() => addRect(getCanvas())}>Rectangle</button>
        <button onClick={() => addText(getCanvas())}>Add Text</button>
        <form onSubmit={(e) => addImg(e, imgURL, getCanvas())}>
          <div>
            <input type='text' value={imgURL} onChange={(e) => setImgURL(e.target.value)} />
            <button type='submit'>Add Image</button>
          </div>
        </form>
      </div>
    </div>
  );
}
