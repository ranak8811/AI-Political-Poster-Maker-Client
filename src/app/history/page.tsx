'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api-client';
import { PosterData } from '@/types/poster';
import HistoryPosterCard from '@/components/HistoryPosterCard';

export default function HistoryPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [posters, setPosters] = useState<PosterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all posters created by the currently logged-in user
  const fetchUserPosters = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Support both user.id and user.userId
      const userId = user.id || (user as any).userId;
      const response = await apiClient.get<{
        success: boolean;
        count: number;
        posters: PosterData[];
      }>(`/api/v1/posters/user/${userId}`);

      if (response.success && Array.isArray(response.posters)) {
        setPosters(response.posters);
      } else {
        setPosters([]);
      }
    } catch (err: any) {
      console.error('Error fetching poster history:', err);
      setError(err?.message || 'Failed to load your poster history.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchUserPosters();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [authLoading, user, fetchUserPosters]);

  // Auth Loading State
  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-12 px-4">
        <div className="w-10 h-10 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-gray-500 text-sm">Checking authentication session...</p>
      </div>
    );
  }

  // Not Logged In State
  if (!user) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to View Your Posters</h2>
        <p className="text-sm text-gray-600 mb-6">
          Your poster history is saved to your account. Please log in or register to access and download your past designs.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/login"
            className="px-6 py-2.5 bg-emerald-700 text-white font-semibold rounded-xl hover:bg-emerald-800 transition-colors shadow-sm"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="px-6 py-2.5 bg-gray-100 text-gray-800 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            My Posters
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage, preview, and re-download your high-resolution political posters.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchUserPosters}
            disabled={loading}
            className="p-2.5 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors border border-gray-200"
            title="Refresh list"
          >
            <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Create New Poster</span>
          </Link>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={fetchUserPosters}
            className="font-semibold underline ml-3 text-red-800"
          >
            Retry
          </button>
        </div>
      )}

      {/* Skeleton Loading Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm animate-pulse"
            >
              <div className="aspect-[3/4] bg-gray-200" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-10 bg-gray-100 rounded-lg mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : posters.length === 0 ? (
        /* Empty State */
        <div className="max-w-md mx-auto py-16 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No Posters Created Yet</h3>
          <p className="text-sm text-gray-500 mb-6">
            You haven't generated any political posters yet. Pick a template and customize your candidate banner in seconds.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-md transition-all"
          >
            <span>Browse Templates</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      ) : (
        /* Posters Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posters.map((poster) => (
            <HistoryPosterCard key={poster._id} poster={poster} />
          ))}
        </div>
      )}
    </div>
  );
}
