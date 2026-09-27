'use client';

import React, { useState } from 'react';

interface DownloadButtonProps {
  imageUrl: string;
  filename?: string;
  className?: string;
}

export default function DownloadButton({
  imageUrl,
  filename = 'political-poster-1200x1600.png',
  className = '',
}: DownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!imageUrl) return;

    try {
      setDownloading(true);

      // Fetch image data as blob so the browser forces a download instead of navigation
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch image for download');
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      // Create a temporary link element and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Clean up DOM and memory
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.warn('Direct blob download failed, opening in new tab instead:', error);
      // Fallback: open image in a new tab if blob fetch was blocked
      window.open(imageUrl, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading || !imageUrl}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      title="Download full 1200x1600 print-ready poster"
    >
      {downloading ? (
        <>
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <span>Downloading High-Res PNG...</span>
        </>
      ) : (
        <>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          <span>Download High-Res PNG (1200×1600)</span>
        </>
      )}
    </button>
  );
}
