import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { softShadows } from '@react-three/drei';
import Cylinder from '../Cylinder/Cylinder';
import SceneDefaults from '../SceneDefaults/SceneDefaults';
import './RaycastScene.scss';

softShadows();

export default function RaycastScene() {
    const [canvasState, setCanvasState] = useState('');
    useEffect(() => {
        const canvas = document.querySelector('#canvas');
        setCanvasState(canvas);
    }, []);

    return (
        <div className='scene'>
            <p className='scene__title'>Canvas</p>
            <div className='scene__canvas'>
                <Canvas shadows linear camera={{ position: [-2, 2, 10], fov: 50 }}>
                    <SceneDefaults>
                        <Cylinder
                            rotation={[-45, 90, 0]}
                            position={[0, 0.5, 0]}
                            color='pink'
                            canvas={canvasState}
                        />
                    </SceneDefaults>
                </Canvas>
            </div>
        </div>
    );
}
