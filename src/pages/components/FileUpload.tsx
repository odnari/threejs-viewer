import React, {ReactElement, useCallback, useRef} from 'react';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    acceptedFileTypes?: string;
    buttonText?: string;
    children: ReactElement;
}

const FileUpload: React.FC<FileUploadProps> = (
    {
        onFileSelect,
        acceptedFileTypes = '.obj,.gltf,.glb,.stl',
        children,
    }
) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onFileSelect(file);
        }
    };

    return (
        <div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{display: 'none'}}
                accept={acceptedFileTypes}
            />
            {
                React.cloneElement(
                    children,
                    {
                        ...children.props,
                        onClick: handleClick,
                    }
                )
            }
        </div>
    );
};

export default FileUpload;