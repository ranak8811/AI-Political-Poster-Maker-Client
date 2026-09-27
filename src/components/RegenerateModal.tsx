'use client';

import React, { useState } from 'react';
import { apiClient } from '@/lib/api-client';

interface RegenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  posterId: string;
  currentHeadline: string;
  regenerationCount: number;
  onRegenerationStarted: () => void;
}

export default function RegenerateModal({
  isOpen,
  onClose,
  posterId,
  currentHeadline,
  regenerationCount,
  onRegenerationStarted,
}: RegenerateModalProps) {
  const [headline, setHeadline] = useState(currentHeadline || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const maxAttempts = 3;
  const isLimitReached = regenerationCount >= maxAttempts;
  const remainingAttempts = Math.max(0, maxAttempts - regenerationCount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLimitReached) return;

    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.post<{
        success: boolean;
        message: string;
        posterId: string;
        regenerationCount: number;
      }>(`/api/v1/posters/${posterId}/regenerate`, {
        formData: {
          headline: headline.trim(),
        },
      });

      if (response.success) {
        onRegenerationStarted();
        onClose();
      } else {
        setError(response.message || 'Failed to start regeneration');
      }
    } catch (err: any) {
      console.error('Regeneration error:', err);
      setError(err?.message || 'Something went wrong while regenerating poster');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          title="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Regenerate Poster</h3>
            <p className="text-xs text-gray-500">
              Attempt {regenerationCount} of {maxAttempts} used ({remainingAttempts} remaining)
            </p>
          </div>
        </div>

        {/* Explanatory Banner */}
        <div className="mb-6 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
          <p className="font-semibold mb-1">How regeneration works:</p>
          <p>
            Google Gemini will rethink the theme colors, background contrast, and layout styling based on your input.
            Photos and candidate profile remain preserved.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
            {error}
          </div>
        )}

        {isLimitReached ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 mx-auto mb-3 text-red-500 bg-red-50 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h4 className="font-bold text-gray-900 mb-1">Regeneration Limit Reached</h4>
            <p className="text-sm text-gray-600 mb-6">
              You have used all 3 allowed regenerations for this poster. You can create a fresh poster from the template gallery.
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Headline / Slogan (বাংলায়)
              </label>
              <textarea
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                required
                rows={3}
                placeholder="যেমন: আসন্ন নির্বাচনে আমাকে জয়যুক্ত করে জনসেবার সুযোগ দিন"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">
                You can edit or adjust the Bengali headline to explore different design nuances.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !headline.trim()}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Starting...</span>
                  </>
                ) : (
                  <span>Regenerate ({remainingAttempts} left)</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
