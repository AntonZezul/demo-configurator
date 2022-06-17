import { useSpring, a } from "@react-spring/three";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { CanvasTexture } from "three";

const Cylinder = ({
    position,
    color = 'lightblue',
    args = [0.5, 0.5, 2, 32],
    rotation,
    canvas,
}) => {
    const mesh = useRef(null);
    const { scene, camera, raycaster, pointer } = useThree()
    const colorMap = new CanvasTexture(canvas);
    const [expand, setExpand] = useState(false);

    const onHover = (event) => {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
    }

    useFrame(() => {
        colorMap.needsUpdate = true
        // colorMap.transformUv(5)
        // const intersects = raycaster.intersectObjects(scene.children);
        // console.log(intersects[1].object.material)
        // for (let i = 1; i < intersects.length; i++) {
        // intersects[0].object.material.map.transformUv(raycaster);
        // }
    });

    useEffect(() => {
        // console.log(scene)
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(scene.children);
        if (expand) {
            intersects[0].object.material.map.offset = pointer;
        }
        // console.log('pointer', pointer)
        // console.log('intersect', intersects[0].object.material.map.center)
        // for (let i = 1; i < intersects.length; i++) {
        // }
        // console.log(intersects[0].object.material.map.center.)
    }, [camera, colorMap, pointer, raycaster, scene.children])
    return (
        <a.mesh
            scale={[1, 1, 1]}
            castShadow
            onPointerDown={(event) => onHover(event)}
            onClick={(e) => setExpand(!expand)}
            rotation={rotation}
            position={position}
            ref={mesh}>
            <cylinderBufferGeometry attach='geometry' args={args} />
            <meshStandardMaterial attach='material' color={color} map={colorMap} />
        </a.mesh>
    );
};

export default Cylinder