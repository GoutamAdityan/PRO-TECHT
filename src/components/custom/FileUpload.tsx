import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';

interface FileUploadProps {
  onFilesAccepted: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesAccepted }) => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...files, ...acceptedFiles].slice(0, 6);
    setFiles(newFiles);
    onFilesAccepted(newFiles);
  }, [files, onFilesAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/gif': [],
    },
    maxFiles: 6,
  });

  const removeFile = (fileToRemove: File) => {
    const newFiles = files.filter(file => file !== fileToRemove);
    setFiles(newFiles);
    onFilesAccepted(newFiles);
  };

  const fileList = files.map((file, index) => (
    <div key={index} className="relative w-24 h-24 border rounded-lg overflow-hidden">
      <img src={URL.createObjectURL(file)} alt={`preview ${index}`} className="w-full h-full object-cover" />
      <button onClick={() => removeFile(file)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1">
        <X className="w-4 h-4" />
      </button>
    </div>
  ));

  return (
    <div className="grid gap-4">
        <div
          {...getRootProps()}
          className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-green-500 bg-green-900/30' : 'border-gray-600 hover:border-green-500'}`}>
          <input {...getInputProps({ multiple: true, capture: 'environment' })} />
          <div className="flex flex-col items-center justify-center">
            <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
            {isDragActive ?
              <p className="text-green-400">Drop the files here ...</p> :
              <p className="text-gray-400">Drag & drop, click, or use camera</p>}
          </div>
        </div>
        {files.length > 0 && (
          <aside className="flex flex-wrap gap-2">
            {fileList}
          </aside>
        )}
    </div>
  );
};

export default FileUpload;
