'use client'
import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { Upload, X, File, CheckCircle } from 'lucide-react';

interface UploadedFile {
  file: File;
  id: string;
  preview?: string;
}

export default function FileUpload() {
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const file: UploadedFile = {
        file: newFiles[0],
        id: Math.random().toString(36).substr(2, 9),
        preview: newFiles[0].type.startsWith('image/') ? URL.createObjectURL(newFiles[0]) : undefined,
    };

    setFile(file);
    
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  function FileInput(){
    return (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-white hover:border-gray-400'
          }`}
        >
          <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium text-gray-700 mb-2">
            Drag and drop files here
          </p>
          <p className="text-sm text-gray-500 mb-4">or</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Files
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
    )
  }

  function SelectedFile({uploadedFile}: {uploadedFile: UploadedFile}){
    return (
        <div
            className={"border-2 rounded-lg p-12 text-center transition-colors bg-white border-gray-300"}
        >
          <div
            className="mb-8 px-4 py-2 shadow-sm rounded-lg transition-colors flex flex-row gap-4"
          >
        
            {uploadedFile.preview ? (
            <img
                src={uploadedFile.preview}
                alt={uploadedFile.file.name}
                className="w-12 h-12 rounded object-cover"
            />
            ) : (
            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                <File className="w-6 h-6 text-gray-400" />
            </div>
            )}
            
            <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">
                    {uploadedFile.file.name}
                </p>
                <p className="text-sm text-gray-500 text-left">
                    {formatFileSize(uploadedFile.file.size)}
                </p>
            </div>
            
            <button
            onClick={() => setFile(null)}
            className="p-1 hover:bg-gray-100 rounded transition-colors shrink-0"
            >
                <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <button 
            className="text-white mb-8 bg-blue-600 hover:bg-blue-700 transition-colors px-6 mt-8 py-2 rounded-lg"
            onClick={() => {}}
           >
            Upload
          </button>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">File Upload</h1>
        
        {(file) ? <SelectedFile uploadedFile={file}/> : <FileInput />}
        
      </div>
    </div>
  );
}