'use client';

import React, { useState, useRef } from 'react';
import apiClient from '@/lib/api-client';

interface PhotoUploadDropzoneProps {
  label: string;
  sublabel?: string;
  required?: boolean;
  value: string; // Cloudinary URL
  onChange: (url: string) => void;
}

export default function PhotoUploadDropzone({
  label,
  sublabel,
  required = false,
  value,
  onChange,
}: PhotoUploadDropzoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle uploading the file to the backend Cloudinary endpoint
  const uploadFile = async (file: File) => {
    setErrorMessage('');

    // Check if user selected an image
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    // Check if file is bigger than 5MB
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size is too large! Maximum limit is 5MB.');
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const data = await apiClient.upload('/api/v1/upload', formData);

      if (data.success && data.url) {
        onChange(data.url);
      } else {
        setErrorMessage(data.message || 'Upload failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Photo upload error:', err);
      setErrorMessage(err.message || 'Cannot connect to upload server. Is the server running?');
    } finally {
      setIsUploading(false);
    }
  };

  // Trigger file input click
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Handle input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  // Drag and drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  // Remove uploaded photo
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {sublabel && <span className="text-xs text-gray-400">{sublabel}</span>}
      </div>

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Box or Image Preview */}
      {value ? (
        // When image is already uploaded
        <div className="relative aspect-[3/4] max-h-56 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center group shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt={label}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
            <button
              type="button"
              onClick={handleClick}
              className="px-3 py-1.5 bg-white text-gray-800 text-xs font-semibold rounded-lg shadow hover:bg-gray-100"
            >
              Change
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg shadow hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        // Dropzone area when no image is uploaded
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
            isDragOver
              ? 'border-[#006A4E] bg-emerald-50/60'
              : 'border-gray-300 hover:border-emerald-600 bg-gray-50/50 hover:bg-gray-50'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center space-y-2 py-4">
              <svg className="animate-spin h-7 w-7 text-[#006A4E]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span className="text-xs text-emerald-800 font-medium">Uploading to Cloudinary...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#006A4E] flex items-center justify-center font-bold text-lg">
                📷
              </div>
              <div className="text-xs text-gray-600">
                <span className="font-semibold text-[#006A4E]">Click to upload</span> or drag and drop
              </div>
              <p className="text-[11px] text-gray-400">PNG, JPG, or WEBP (Max 5MB)</p>
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <p className="text-xs text-red-600 font-medium mt-1">⚠️ {errorMessage}</p>
      )}
    </div>
  );
}
