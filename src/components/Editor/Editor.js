import React, { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import './Editor.scss';

export default function Editor() {
  const [canvas, setCanvas] = useState('');
  const [imgURL, setImgURL] = useState('');

  const initCanvas = () =>
    new fabric.Canvas('canvas', {
      height: 550,
      width: 550,
      backgroundColor: 'pink',
    });

  const addRect = (canvi) => {
    const rect = new fabric.Rect({
      height: 100,
      width: 100,
      fill: 'red',
    });
    canvi.add(rect);
    canvi.renderAll();
  };
  const addImg = (e, url, canvi) => {
    e.preventDefault();
    new fabric.Image.fromURL(url, (img) => {
      img.scale(0.75);
      canvi.add(img);
      canvi.renderAll();
      setImgURL('');
    });
  };

  useEffect(() => {
    setCanvas((prev) => (!prev ? initCanvas() : prev));
  }, []);

  return (
    <div className='editor'>
      <p className='editor__title'>Edit shape</p>
      <div className='editor__workspace'>
        <canvas id='canvas' />
      </div>
      <button onClick={() => addRect(canvas)}>Rectangle</button>
      <form onSubmit={(e) => addImg(e, imgURL, canvas)}>
        <div>
          <input
            type='text'
            value={imgURL}
            onChange={(e) => setImgURL(e.target.value)}
          />
          <button type='submit'>Add Image</button>
        </div>
      </form>
    </div>
  );
}
