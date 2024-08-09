import React, {useCallback, useRef, useState} from 'react';
import {useFrame, useThree} from '@react-three/fiber';
import * as THREE from 'three';

const SelectableModel = ({object}) => {
    const ref = useRef();
    const {raycaster, camera, gl} = useThree();
    const [selectedFaces, setSelectedFaces] = useState(new Set());
    const [mouse, setMouse] = useState(new THREE.Vector2());

    const onMouseMove = useCallback((event) => {
        const canvas = gl.domElement;
        const rect = canvas.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        setMouse(new THREE.Vector2(x, y));
    }, [gl]);

    useFrame(() => {
        // Update the picking ray with the camera and mouse position
        raycaster.setFromCamera(mouse, camera);

        // Calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObject(ref.current, true);

        // Reset all face colors
        ref.current.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                if (selectedFaces.has(child.userData.faceIndex)) {
                    child.material.color.setHex(0x0000ff); // Keep selected faces blue
                } else {
                    child.material.color.setHex(0x33e316); // Reset to original color
                }
            }
        });

        // Highlight hovered face
        if (intersects.length > 0) {
            const intersectedFace = intersects[0].object;
            if (!selectedFaces.has(intersectedFace.userData.faceIndex)) {
                intersectedFace.material.color.setHex(0xff0000); // Highlight hovered face in red
            }
        }
    });

    const handleClick = (event) => {
        event.stopPropagation();

        // Calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObject(ref.current, true);

        if (intersects.length > 0) {
            const intersectedFace = intersects[0].object;
            const faceIndex = intersectedFace.userData.faceIndex;

            setSelectedFaces(prev => {
                const newSet = new Set(prev);
                if (newSet.has(faceIndex)) {
                    newSet.delete(faceIndex);
                } else {
                    newSet.add(faceIndex);
                }
                return newSet;
            });
        }
    };

    React.useEffect(() => {
        const canvas = gl.domElement;
        canvas.addEventListener('mousemove', onMouseMove);
        return () => {
            canvas.removeEventListener('mousemove', onMouseMove);
        };
    }, [gl, onMouseMove]);

    return <primitive ref={ref} object={object} onClick={handleClick}/>;
};

export default SelectableModel;