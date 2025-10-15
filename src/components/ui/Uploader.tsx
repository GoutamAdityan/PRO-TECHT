import React, { useState, useCallback, useRef, useEffect, useReducer } from 'react';
import { useDropzone } from 'react-dropzone'; // Assuming react-dropzone is available
import { cn } from '@/lib/utils';
import { X, FileText, Image, Loader2 } from 'lucide-react';
import { Button } from './button';
import { Progress } from './progress';

interface FileWithPreview {
  originalFile: File; // Store the actual File object
  preview: string;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
}

interface UploaderProps {
  onFilesChange: (files: File[]) => void; // Now expects an array of native File objects
  maxFiles?: number;
  maxSize?: number; // in bytes
  accept?: Record<string, string[]>;
}

// Reducer actions
type Action = 
  | { type: 'ADD_FILES'; files: FileWithPreview[] }
  | { type: 'REMOVE_FILE'; id: string }
  | { type: 'UPDATE_FILE'; id: string; updates: Partial<FileWithPreview> };

// Reducer function
const filesReducer = (state: FileWithPreview[], action: Action): FileWithPreview[] => {
  switch (action.type) {
    case 'ADD_FILES':
      return [...state, ...action.files];
    case 'REMOVE_FILE':
      return state.filter(file => file.id !== action.id);
    case 'UPDATE_FILE':
      return state.map(file => 
        file.id === action.id ? { ...file, ...action.updates } : file
      );
    default:
      return state;
  }
};

export const Uploader: React.FC<UploaderProps> = ({
  onFilesChange,
  maxFiles = 10,
  maxSize = 1024 * 1024 * 5, // 5MB
  accept = { 'image/*': ['.jpeg', '.png', '.gif'] },
}) => {
  const [files, dispatch] = useReducer(filesReducer, []); // Use useReducer
  const fileIdCounter = useRef(0);
  const uploadIntervals = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      originalFile: file, // Store the original File object
      preview: URL.createObjectURL(file),
      id: `file-${fileIdCounter.current++}`,
      progress: 0,
      status: 'uploading', // Set initial status to uploading here
    }));
    dispatch({ type: 'ADD_FILES', files: newFiles }); // Dispatch action
    onFilesChange([...files, ...newFiles].map(f => f.originalFile)); // Pass original File objects to parent
  }, [maxFiles, onFilesChange, files]); // Added files to dependency array for onFilesChange

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept,
  });

  const removeFile = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_FILE', id }); // Dispatch action
    // Clear interval if file was being uploaded
    if (uploadIntervals.current.has(id)) {
      clearInterval(uploadIntervals.current.get(id)!);
      uploadIntervals.current.delete(id);
    }
    onFilesChange(files.filter(f => f.id !== id).map(f => f.originalFile)); // Update parent
  }, [files, onFilesChange]);

  // Simulate upload progress (for demo purposes)
  useEffect(() => {
    files.forEach((file) => {
      // Only process files that are currently uploading and don't have an active interval
      if (file.status === 'uploading' && !uploadIntervals.current.has(file.id)) {
        let progress = file.progress; // Start from current progress
        const interval = setInterval(() => {
          progress += 10;
          if (progress >= 100) {
            clearInterval(uploadIntervals.current.get(file.id)!);
            uploadIntervals.current.delete(file.id);
            dispatch({ type: 'UPDATE_FILE', id: file.id, updates: { progress: 100, status: 'completed' } });
          } else {
            dispatch({ type: 'UPDATE_FILE', id: file.id, updates: { progress } });
          }
        }, 100);
        uploadIntervals.current.set(file.id, interval); // Store interval
      }
    });

    return () => {
      uploadIntervals.current.forEach(clearInterval);
      uploadIntervals.current.clear();
    };
  }, [files, dispatch]); // dispatch is stable, so it won't cause re-renders

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
                {file.originalFile.type.startsWith('image/') ? (
                  <img src={file.preview} alt={file.originalFile.name} className="h-12 w-12 object-cover rounded-md border" />
                ) : (
                  <div className="h-12 w-12 flex items-center justify-center bg-muted rounded-md border">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium truncate">{file.originalFile.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.originalFile.size / 1024).toFixed(1)} KB</p>
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
                {file.originalFile.type.startsWith('image/') ? (
                  <img src={file.preview} alt={file.originalFile.name} className="h-12 w-12 object-cover rounded-md border" />
                ) : (
                  <div className="h-12 w-12 flex items-center justify-center bg-muted rounded-md border">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium truncate">{file.originalFile.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.originalFile.size / 1024).toFixed(1)} KB</p>
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
