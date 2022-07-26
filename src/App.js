import React from 'react';
import Editor from './components/Editor/Editor';
import Scene from './components/Scene/Scene';

export default function App() {
  return (
    <div className='app'>
      <Editor />
      {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#1b2430' }}>
        <img id='svgImageID' width={512} height={512} alt='' src='/assets/textures/texture.svg'></img>
      </div> */}
      <Scene />
    </div>
  );
}
