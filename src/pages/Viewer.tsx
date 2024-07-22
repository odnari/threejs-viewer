import {useCallback, useState} from 'react'
import {Canvas} from '@react-three/fiber'
import {Bvh, OrbitControls} from '@react-three/drei'
import * as THREE from "three"
import {Group} from "three"
import Model from './components/Model'
import DeletedMeshList from './components/DeletedMeshList'
import SceneLighting from './components/SceneLighting'
import FileUpload from "./components/FileUpload.tsx";
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js'


export default function Viewer() {
    const [deletedMeshes, setDeletedMeshes] = useState<string[]>([])
    const [files, setFiles] = useState<Group<THREE.Object3DEventMap>[]>([])

    const onDeleteMesh = useCallback((uuid: string) => {
        setDeletedMeshes(prevMeshes =>
            prevMeshes.includes(uuid)
                ? prevMeshes.filter(mesh => mesh !== uuid)
                : [...prevMeshes, uuid]
        )
    }, [])

    const onFileSelect = useCallback((file: File) => {
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = () => {
            const object = new OBJLoader().parse(reader.result as string);
            object.name = file.name;
            object.traverse(child => {
                if (child.type === 'Mesh') {
                    child.castShadow = true
                    child.receiveShadow = true
                    child['material'] = new THREE.MeshNormalMaterial()
                    child['material'].color = new THREE.Color(0x33e316)
                }
            })
            setFiles(prevFiles => [...prevFiles, object]);
        }

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
                        <primitive key={object.name} object={object} position={[0, -0.25, 0.25 * (index + 1)]}/>
                    ))}
                    <Model
                        onDeleteMesh={onDeleteMesh}
                        deletedMeshes={deletedMeshes}
                        url='/models/Brain1.obj'
                    />
                </Bvh>
                <OrbitControls/>
            </Canvas>
        </div>
    )
}