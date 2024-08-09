/* eslint-disable no-case-declarations */
import {useCallback, useState} from 'react'
import {Canvas} from '@react-three/fiber'
import {Bvh, OrbitControls} from '@react-three/drei'
import * as THREE from "three"
import {Group} from "three"
import DeletedMeshList from './components/DeletedMeshList'
import SceneLighting from './components/SceneLighting'
import FileUpload from "./components/FileUpload.tsx";
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js'
import {STLLoader} from "three/addons/loaders/STLLoader.js";

export default function Viewer() {
    const [deletedMeshes, setDeletedMeshes] = useState<string[]>([])
    const [files, setFiles] = useState<Group<THREE.Object3DEventMap>[]>([])

    const onFileSelect = useCallback((file: File) => {
        const reader = new FileReader();

        if (file.name.toLowerCase().endsWith('.stl')) {
            reader.readAsArrayBuffer(file);
        } else {
            reader.readAsText(file, "UTF-8");
        }

        reader.onload = (event) => {
            let object: THREE.Group | THREE.Mesh;
            const extension = file.name.split('.').pop()?.toLowerCase();

            switch (extension) {
                case 'obj':
                    object = new OBJLoader().parse(event.target?.result as string);
                    break;
                case 'stl':
                    const geometry = new STLLoader().parse(event.target?.result as ArrayBuffer);
                    const material = new THREE.MeshNormalMaterial();
                    object = new THREE.Mesh(geometry, material);
                    break;
                default:
                    console.error('Unsupported file format');
                    return;
            }

            // Apply common properties
            object.name = file.name;
            object.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material = new THREE.MeshNormalMaterial();
                    child.material.color = new THREE.Color(0x33e316);
                }
            });

            // If it's a single mesh (STL), wrap it in a Group
            if (object instanceof THREE.Mesh) {
                const group = new THREE.Group();
                group.add(object);
                object = group;
            }

            // Center and scale the object
            const box = new THREE.Box3().setFromObject(object);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            // Move the object to center
            object.position.sub(center);

            // Scale the object
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 1 / maxDim;
            object.scale.multiplyScalar(scale);

            setFiles(prevFiles => [...prevFiles, object as THREE.Group]);
        };

        reader.onerror = () => {
            console.error(reader.error)
        }
    }, [])

    return (
        <div className="w-full h-full">
            <nav className={'flex items-center gap-4 py-2 px-4 w-full leading-none border-b border-gray-300'}>
                <h1 className="text-base font-bold">3D Model Viewer</h1>
                <FileUpload onFileSelect={onFileSelect}>
                    <button type={'button'}>Open</button>
                </FileUpload>
            </nav>
            <DeletedMeshList
                deletedMeshes={deletedMeshes}
                setDeletedMeshes={setDeletedMeshes}
            />
            <Canvas>
                <SceneLighting/>
                <primitive object={new THREE.AxesHelper(10)}/>
                <Bvh firstHitOnly>
                    {files.map((object, index) => (
                        <primitive key={object.uuid} object={object} position={[0, 0, 0]}/>
                    ))}
                </Bvh>
                <OrbitControls/>
            </Canvas>
        </div>
    )
}