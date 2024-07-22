import {MeshProps} from '@react-three/fiber'
import * as THREE from "three";
import {ReactNode} from "react";

interface MeshComponentProps {
    child: THREE.Mesh
    onDeleteMesh: (uuid: string) => void
    onPointerOver: (event: THREE.Event) => void
    onPointerOut: () => void
    isHovered: boolean,
    visible: boolean
}

export default function MeshComponent({
                                          child,
                                          onDeleteMesh,
                                          onPointerOver,
                                          onPointerOut,
                                          isHovered,
                                          visible,
                                      }: MeshComponentProps) {
    const extraProps: Partial<MeshProps> = {}

    if (isHovered && child.material) {
        const material = Array.isArray(child.material)
            ? child.material[0].clone()
            : child.material.clone()

        if ('color' in material) {
            (material.color as THREE.Color).setHex(0x33e316)
        }
        extraProps.material = material
    }

    return (
        <mesh
            {...child}
            {...extraProps}
            onClick={(event) => {
                event.stopPropagation()
                onDeleteMesh(child.uuid)
            }}
            onPointerOver={onPointerOver}
            onPointerOut={onPointerOut}
            children={child?.children as ReactNode}
            visible={visible}
        />
    )
}