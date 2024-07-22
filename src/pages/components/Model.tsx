import {useCallback, useState} from 'react'
import {useLoader} from '@react-three/fiber'
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js'
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js'
import MeshComponent from './MeshComponent'
import * as THREE from "three";

interface ModelProps {
    url: string
    onDeleteMesh: (uuid: string) => void
    deletedMeshes: string[]
}

export default function Model({url, onDeleteMesh, deletedMeshes}: ModelProps) {
    const [hovered, setHovered] = useState<string | null>(null)

    const materials = useLoader(MTLLoader, url.replace('.obj', '.mtl'))
    const obj = useLoader(OBJLoader, url, (loader) => {
        materials.preload()
        loader.setMaterials(materials)
    })

    const handlePointerOver = useCallback((event) => {
        event.stopPropagation()
        setHovered(event.object.uuid)
    }, [])

    const handlePointerOut = useCallback(() => {
        setHovered(null)
    }, [])

    return (
        <group position={[0, -0.25, 0]}>
            {obj.children.map((child) => (
                child.type === 'Mesh' && (
                    <MeshComponent
                        key={child.uuid}
                        child={child as THREE.Mesh}
                        onDeleteMesh={onDeleteMesh}
                        onPointerOver={handlePointerOver}
                        onPointerOut={handlePointerOut}
                        isHovered={hovered === child.uuid}
                        visible={!deletedMeshes.includes(child.uuid)}
                    />
                )
            ))}
        </group>
    )
}