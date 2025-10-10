
// src/components/ui/Uploader.tsx
import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone'; // Assuming react-dropzone is available
import { cn } from '@/lib/utils';
import { X, FileText, Image, Loader2 } from 'lucide-react';
import { Button } from './button';
import { Progress } from './progress';

interface FileWithPreview extends File {
  preview: string;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
}

interface UploaderProps {
  onFilesChange: (files: FileWithPreview[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  accept?: Record<string, string[]>;
}

export const Uploader: React.FC<UploaderProps> = ({
  onFilesChange,
  maxFiles = 10,
  maxSize = 1024 * 1024 * 5, // 5MB
  accept = { 'image/*': ['.jpeg', '.png', '.gif'], 'application/pdf': ['.pdf'] },
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const fileIdCounter = useRef(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        id: `file-${fileIdCounter.current++}`,
        progress: 0,
        status: 'pending',
      })
    );
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles, ...newFiles].slice(0, maxFiles);
      onFilesChange(updatedFiles);
      return updatedFiles;
    });
  }, [maxFiles, onFilesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept,
  });

  const removeFile = (id: string) => {
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((file) => file.id !== id);
      onFilesChange(updatedFiles);
      return updatedFiles;
    });
  };

  // Simulate upload progress (for demo purposes)
  useEffect(() => {
    files.forEach((file) => {
      if (file.status === 'pending') {
        setFiles((prevFiles) =>
          prevFiles.map((f) => (f.id === file.id ? { ...f, status: 'uploading' } : f))
        );
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          if (progress >= 100) {
            clearInterval(interval);
            setFiles((prevFiles) =>
              prevFiles.map((f) => (f.id === file.id ? { ...f, progress: 100, status: 'completed' } : f))
            );
          } else {
            setFiles((prevFiles) =>
              prevFiles.map((f) => (f.id === file.id ? { ...f, progress } : f))
            );
          }
        }, 100);
      }
    });
  }, [files]);

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
          "bg-background/50 border-border/50 hover:bg-accent/10",
          isDragActive ? "border-primary bg-primary/5" : ""
        )}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-primary font-medium">Drop the files here ...</p>
        ) : (
          <p className="text-muted-foreground text-center">
            Drag 'n' drop some files here, or click to select files
            <br />
            <span className="text-xs">(Max {maxFiles} files, {maxSize / (1024 * 1024)}MB each)</span>
          </p>
        )}
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {files.map((file) => (
            <div key={file.id} className="relative p-3 border rounded-lg bg-card/50 backdrop-blur-sm shadow-sm">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-background/50 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => removeFile(file.id)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-3">
                {file.type.startsWith('image/') ? (
                  <img src={file.preview} alt={file.name} className="h-12 w-12 object-cover rounded-md border" />
                ) : (
                  <div className="h-12 w-12 flex items-center justify-center bg-muted rounded-md border">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              {file.status === 'uploading' && (
                <Progress value={file.progress} className="w-full mt-2 h-2" />
              )}
              {file.status === 'failed' && (
                <p className="text-xs text-destructive mt-1">Upload failed</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
