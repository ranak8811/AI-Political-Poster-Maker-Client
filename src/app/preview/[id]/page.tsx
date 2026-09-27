'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { formatDate } from '@/lib/utils';
import { PosterData } from '@/types/poster';
import DownloadButton from '@/components/DownloadButton';
import RegenerateModal from '@/components/RegenerateModal';

export default function PosterPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const posterId = params?.id as string;

  const [poster, setPoster] = useState<PosterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pollTick, setPollTick] = useState(0);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);

  // Fetch poster details from API
  const fetchPoster = useCallback(async () => {
    if (!posterId) return;

    try {
      const response = await apiClient.get<{ success: boolean; poster: PosterData }>(
        `/api/v1/posters/${posterId}`
      );

      if (response.success && response.poster) {
        setPoster(response.poster);
        setError(null);
      } else {
        setError('Poster not found or failed to load.');
      }
    } catch (err: any) {
      console.error('Failed to load poster:', err);
      setError(err?.message || 'Failed to fetch poster information.');
    } finally {
      setLoading(false);
    }
  }, [posterId]);

  // Initial load
  useEffect(() => {
    fetchPoster();
  }, [fetchPoster]);

  // Status Polling Effect: Poll every 2 seconds while status is 'generating'
  useEffect(() => {
    if (!poster || poster.status !== 'generating') {
      return;
    }

    const intervalId = setInterval(() => {
      setPollTick((prev) => prev + 1);
      fetchPoster();
    }, 2000);

    return () => clearInterval(intervalId);
  }, [poster?.status, fetchPoster]);

  // Helper to determine generation progress message
  const getGeneratingMessage = () => {
    if (pollTick <= 1) {
      return 'Google Gemini AI is analyzing your occasion and designing color harmony...';
    }
    if (pollTick <= 3) {
      return 'Rendering 1200×1600 canvas with Kalpurush TrueType Bengali typography...';
    }
    return 'Finalizing composite and streaming high-resolution PNG to Cloudinary...';
  };

  if (loading && !poster) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center py-12 px-4">
        <div className="w-12 h-12 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading poster details...</p>
      </div>
    );
  }

  if (error || !poster) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Poster Not Available</h2>
        <p className="text-gray-600 mb-6">{error || 'Could not find the requested poster.'}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              setLoading(true);
              fetchPoster();
            }}
            className="px-5 py-2.5 bg-emerald-700 text-white rounded-xl font-semibold hover:bg-emerald-800 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const isGenerating = poster.status === 'generating';
  const isFailed = poster.status === 'failed';
  const isCompleted = poster.status === 'completed' && Boolean(poster.generatedImageUrl);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-emerald-700 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/create" className="hover:text-emerald-700 transition-colors">
          Poster Maker
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Live Preview</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 1200x1600 3:4 Poster Preview Display */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full max-w-[480px] aspect-[3/4] relative rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-900/10 bg-gray-950 flex items-center justify-center">
            {isGenerating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-8 h-8 text-emerald-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                </div>

                <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-full mb-3 uppercase tracking-wider">
                  Live Generation in Progress
                </span>

                <h3 className="text-xl font-bold mb-2">Generating Political Poster...</h3>
                <p className="text-sm text-gray-400 max-w-xs transition-all duration-300">
                  {getGeneratingMessage()}
                </p>

                <div className="mt-8 flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Polling server every 2s</span>
                </div>
              </div>
            )}

            {isFailed && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gray-900 text-white">
                <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-1">Rendering Encountered an Error</h3>
                <p className="text-xs text-gray-400 mb-6 max-w-sm">
                  {poster.errorMessage || 'Server could not complete rendering with the provided parameters.'}
                </p>
                <button
                  onClick={() => setShowRegenerateModal(true)}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  Retry Poster Generation
                </button>
              </div>
            )}

            {isCompleted && (
              <img
                src={poster.generatedImageUrl}
                alt={poster.formData?.headline || 'Generated Political Poster'}
                className="w-full h-full object-cover rounded-xl transition-all duration-500"
              />
            )}
          </div>

          {/* Quick full-size link */}
          {isCompleted && poster.generatedImageUrl && (
            <a
              href={poster.generatedImageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 text-xs text-gray-500 hover:text-emerald-700 inline-flex items-center gap-1 transition-colors"
            >
              <span>View full 1200×1600 original image in new tab</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>

        {/* Right Column: Poster Details & Action Dashboard */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  isCompleted
                    ? 'bg-emerald-50 text-emerald-700'
                    : isGenerating
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isCompleted
                      ? 'bg-emerald-600'
                      : isGenerating
                      ? 'bg-amber-600 animate-pulse'
                      : 'bg-red-600'
                  }`}
                />
                {isCompleted ? 'Ready to Print' : isGenerating ? 'Generating...' : 'Failed'}
              </span>

              <span className="text-xs text-gray-400">
                Created: {formatDate(poster.createdAt)}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {poster.formData.name}
            </h1>
            <p className="text-sm text-gray-600 mb-4">
              {poster.formData.designation} {poster.formData.locality && `· ${poster.formData.locality}`}
            </p>

            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 mb-6">
              <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Main Headline (বাংলা)
              </span>
              <p className="text-base font-bold text-gray-900 leading-snug">
                "{poster.formData.headline}"
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* High-Res Download Button */}
              {isCompleted && poster.generatedImageUrl && (
                <DownloadButton
                  imageUrl={poster.generatedImageUrl}
                  filename={`political-poster-${poster.formData.name}.png`}
                  className="w-full text-base py-4"
                />
              )}

              {/* Regenerate Button */}
              <button
                onClick={() => setShowRegenerateModal(true)}
                disabled={isGenerating || poster.regenerationCount >= 3}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-gray-800 bg-gray-100 hover:bg-gray-200 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>
                  {poster.regenerationCount >= 3
                    ? 'Regeneration Limit Reached (3/3)'
                    : `Regenerate Poster (${3 - poster.regenerationCount} left)`}
                </span>
              </button>
            </div>
          </div>

          {/* Poster Metadata Specs Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Poster Specifications</span>
            </h3>

            <div className="divide-y divide-gray-100">
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Print Resolution</span>
                <span className="font-semibold text-gray-800">1200 × 1600 px (3:4)</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Bengali Typography</span>
                <span className="font-semibold text-gray-800">Kalpurush TrueType</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">AI Layout Engine</span>
                <span className="font-semibold text-gray-800">Gemini 2.5 Flash</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Political Party</span>
                <span className="font-semibold text-gray-800">{poster.formData.party}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Slogan Credit Bar</span>
                <span className="font-semibold text-gray-800 text-right truncate max-w-[200px]" title={poster.formData.creditLine}>
                  {poster.formData.creditLine || 'প্রচারে: এলাকাবাসী'}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
              <Link href="/create" className="text-emerald-700 font-semibold hover:underline">
                + Create New Poster
              </Link>
              <Link href="/" className="hover:underline">
                Explore All Templates
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Regeneration Modal */}
      <RegenerateModal
        isOpen={showRegenerateModal}
        onClose={() => setShowRegenerateModal(false)}
        posterId={poster._id}
        currentHeadline={poster.formData.headline}
        regenerationCount={poster.regenerationCount}
        onRegenerationStarted={() => {
          setPoster((prev) => (prev ? { ...prev, status: 'generating' } : null));
          setPollTick(0);
        }}
      />
    </div>
  );
}
