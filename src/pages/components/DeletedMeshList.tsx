import React, {useState} from 'react'

interface DeletedMeshListProps {
    deletedMeshes: string[]
    setDeletedMeshes: React.Dispatch<React.SetStateAction<string[]>>
}

export default function DeletedMeshList({deletedMeshes, setDeletedMeshes}: DeletedMeshListProps) {
    const [showDeletedMeshes, setShowDeletedMeshes] = useState(false)

    if (deletedMeshes.length === 0) return null

    return (
        <div
            className='bg-gray-600 mt-10 opacity-80 px-3 py-2 font-mono text-white rounded-lg flex flex-col gap-0.5 absolute top-2 left-2 z-10'>
            <div onClick={() => setShowDeletedMeshes(!showDeletedMeshes)}
                 className='flex font-bold border-b border-gray-800'>
                Hidden Mesh List
            </div>
            {showDeletedMeshes && deletedMeshes.map((mesh) => (
                <div key={mesh} className='flex justify-between items-center'>
                    {mesh}
                    <button className='ml-6' onClick={() => setDeletedMeshes(deletedMeshes.filter((m) => m !== mesh))}>
                        restore
                    </button>
                </div>
            ))}
        </div>
    )
}