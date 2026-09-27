'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import PosterForm from '@/components/PosterForm';
import { Template } from '@/types/template';
import apiClient from '@/lib/api-client';

function CreatePosterContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const templateSlug = searchParams.get('template') || 'victory-day';

  const [template, setTemplate] = useState<Template | null>(null);
  const [allTemplates, setAllTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch the selected template and list of all templates for easy switching
  useEffect(() => {
    async function loadTemplateData() {
      setIsLoading(true);
      setError('');

      try {
        // 1. Fetch all templates for quick switcher dropdown
        const allData = await apiClient.get('/api/v1/templates');
        if (allData.success && allData.data) {
          setAllTemplates(allData.data);
        }

        // 2. Fetch specific template details
        const data = await apiClient.get(`/api/v1/templates/${templateSlug}`);

        if (data.success && data.data) {
          setTemplate(data.data);
        } else {
          // If specific slug not found, fallback to first available template
          if (allData.data && allData.data.length > 0) {
            setTemplate(allData.data[0]);
          } else {
            setError('Could not find template data. Please verify your backend server.');
          }
        }
      } catch (err: any) {
        console.error('Failed to load template:', err);
        setError(err.message || 'Cannot connect to template API.');
      } finally {
        setIsLoading(false);
      }
    }

    loadTemplateData();
  }, [templateSlug]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2 text-xs text-gray-500 mb-1">
            <Link href="/" className="hover:text-[#006A4E] transition">Templates</Link>
            <span>/</span>
            <span className="text-gray-800 font-semibold">Create Poster</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Design Political Banner
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Fill in the details below to generate your 1200×1600 print-ready poster.
          </p>
        </div>

        {/* Template Quick Switcher Dropdown */}
        {allTemplates.length > 0 && (
          <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-500 font-medium">Theme:</span>
            <select
              value={template?.slug || templateSlug}
              onChange={(e) => router.push(`/create?template=${e.target.value}`)}
              className="text-xs font-bold text-[#006A4E] bg-transparent outline-none cursor-pointer"
            >
              {allTemplates.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Loading Shimmer */}
      {isLoading && (
        <div className="space-y-6 animate-pulse">
          <div className="h-28 bg-gray-200 rounded-2xl" />
          <div className="h-96 bg-gray-200 rounded-2xl" />
        </div>
      )}

      {/* Error Banner */}
      {error && !isLoading && (
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center space-y-3">
          <p className="text-sm text-red-700 font-semibold">{error}</p>
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-[#006A4E] text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 transition"
          >
            ← Back to Template Selection
          </Link>
        </div>
      )}

      {/* Main Content Area */}
      {!isLoading && template && (
        <div className="space-y-8">
          {/* Selected Template Summary Card */}
          <div className="bg-gradient-to-r from-emerald-900 to-[#006A4E] text-white p-5 rounded-2xl shadow-md flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className="w-14 h-18 rounded-lg bg-cover bg-center border border-white/30 shadow-inner flex-shrink-0"
                style={{ backgroundImage: `url(${template.thumbnailUrl})` }}
              />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-emerald-100">
                  {template.occasionType.replace('_', ' ')}
                </span>
                <h2 className="text-lg sm:text-xl font-bold mt-1 text-white">
                  {template.title}
                </h2>
                <p className="text-xs text-emerald-200 line-clamp-1 mt-0.5">
                  &quot;{template.layoutConfig?.defaultHeadline}&quot;
                </p>
              </div>
            </div>

            <Link
              href="/"
              className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg border border-white/20 transition hidden sm:inline-block"
            >
              Change Theme
            </Link>
          </div>

          {/* Controlled Poster Form Component */}
          <PosterForm template={template} />
        </div>
      )}
    </div>
  );
}

export default function CreatePosterPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-4 py-20 text-center">
          <div className="animate-spin h-8 w-8 text-[#006A4E] mx-auto mb-4 border-2 border-current border-t-transparent rounded-full" />
          <p className="text-sm text-gray-500 font-medium">Loading poster design studio...</p>
        </div>
      }
    >
      <CreatePosterContent />
    </Suspense>
  );
}
