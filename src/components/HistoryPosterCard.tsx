'use client';

import React from 'react';
import Link from 'next/link';
import { PosterData } from '@/types/poster';
import { formatDate } from '@/lib/utils';
import DownloadButton from './DownloadButton';

interface HistoryPosterCardProps {
  poster: PosterData;
}

export default function HistoryPosterCard({ poster }: HistoryPosterCardProps) {
  const isCompleted = poster.status === 'completed' && Boolean(poster.generatedImageUrl);
  const isGenerating = poster.status === 'generating';
  const isFailed = poster.status === 'failed';

  const templateTitle =
    typeof poster.templateId === 'object' && poster.templateId !== null
      ? poster.templateId.title
      : 'Political Poster';

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col group">
      {/* 3:4 Aspect Ratio Thumbnail / Preview */}
      <div className="relative aspect-[3/4] bg-gray-900 overflow-hidden">
        {isCompleted ? (
          <img
            src={poster.generatedImageUrl}
            alt={poster.formData.name || 'Poster Preview'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : isGenerating ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-gray-950 text-white">
            <div className="w-10 h-10 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-3" />
            <span className="text-xs font-semibold text-emerald-400">Rendering...</span>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-gray-900 text-white">
            <span className="text-xs text-red-400 font-semibold">Generation Failed</span>
          </div>
        )}

        {/* Status Badge overlay */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md shadow-sm ${
              isCompleted
                ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-500/30'
                : isGenerating
                ? 'bg-amber-900/80 text-amber-200 border border-amber-500/30'
                : 'bg-red-900/80 text-red-200 border border-red-500/30'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isCompleted
                  ? 'bg-emerald-400'
                  : isGenerating
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-red-400'
              }`}
            />
            {isCompleted ? 'Ready' : isGenerating ? 'In Progress' : 'Failed'}
          </span>
        </div>

        {/* Template Tag overlay */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-black/60 text-white backdrop-blur-sm">
            {templateTitle}
          </span>
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
            <span>{formatDate(poster.createdAt)}</span>
            {poster.regenerationCount > 0 && (
              <span className="text-emerald-700 font-medium text-[11px]">
                {poster.regenerationCount} {poster.regenerationCount === 1 ? 'regen' : 'regens'}
              </span>
            )}
          </div>

          <h3 className="font-bold text-gray-900 text-base line-clamp-1 group-hover:text-emerald-700 transition-colors">
            {poster.formData.name}
          </h3>

          <p className="text-xs text-gray-500 mb-2 line-clamp-1">
            {poster.formData.designation} · {poster.formData.party}
          </p>

          <p className="text-xs text-gray-700 italic bg-gray-50 p-2.5 rounded-lg line-clamp-2 border border-gray-100">
            "{poster.formData.headline}"
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-2">
          <Link
            href={`/preview/${poster._id}`}
            className="flex-1 text-center py-2 px-3 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
          >
            View Poster
          </Link>

          {isCompleted && poster.generatedImageUrl && (
            <DownloadButton
              imageUrl={poster.generatedImageUrl}
              filename={`political-poster-${poster.formData.name || 'poster'}.png`}
              className="py-2 px-3 text-xs"
            />
          )}
        </div>
      </div>
    </div>
  );
}
