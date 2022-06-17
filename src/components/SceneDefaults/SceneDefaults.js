import { OrbitControls } from '@react-three/drei'
import React, { Suspense } from 'react'

export default function SceneDefaults({ children }) {
    return (
        <Suspense fallback={null}>
            <ambientLight intensity={0.3} />
            <directionalLight
                castShadow
                position={[0, 10, 0]}
                intensity={1.5}
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-camera-far={50}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
            />
            <pointLight position={[-10, 0, -20]} intensity={0.5} />
            <pointLight position={[0, -10, 0]} intensity={1.5} />

            <group>
                <mesh
                    receiveShadow
                    rotation={[-Math.PI / 2, 0, 0]}
                    position={[0, -3, 0]}>
                    <planeBufferGeometry attach='geometry' args={[100, 100]} />
                    <shadowMaterial attach='material' opacity={0.3} />
                </mesh>
                {children}
            </group>
            <OrbitControls minDistance={3} maxDistance={7} />
        </Suspense>
    )
}
