'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import OccasionFilter from '@/components/OccasionFilter';
import TemplateCard from '@/components/TemplateCard';
import { Template } from '@/types/template';
import apiClient from '@/lib/api-client';

export default function Home() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedOccasion, setSelectedOccasion] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch templates from Backend API using apiClient
  const fetchTemplates = async (occasion: string = 'ALL') => {
    setIsLoading(true);
    setError(null);

    try {
      const endpoint =
        occasion === 'ALL'
          ? '/api/v1/templates'
          : `/api/v1/templates?occasion=${occasion}`;

      const data = await apiClient.get(endpoint);

      if (data.success && data.data) {
        setTemplates(data.data);
      } else {
        setError(data.message || 'Failed to load templates.');
      }
    } catch (err: any) {
      console.error('Error fetching templates:', err);
      setError(err.message || 'Could not connect to the backend server to load templates.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates(selectedOccasion);
  }, [selectedOccasion]);

  return (
    <div className="flex flex-col min-h-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-[#006A4E] text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-emerald-800/80 border border-emerald-600/50 px-4 py-1.5 rounded-full text-xs font-semibold text-emerald-200 mb-6 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[#F42A41] animate-pulse"></span>
            <span>Intelligent Bengali Political Banner Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            From Grassroots Form to <br className="hidden sm:inline" />
            <span className="text-amber-300">Print-Ready Political Posters</span> in Seconds
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
            Generate authentic Bangladeshi political posters for Victory Day, election campaigns,
            and memorial tributes. Powered by AI-guided layout composition and high-res Bengali typography.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#templates-section"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#F42A41] hover:bg-red-700 text-white font-bold text-base shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
            >
              <span>Explore Templates</span>
              <span>↓</span>
            </a>
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base border border-white/20 transition-colors flex items-center justify-center"
            >
              <span>Create Account</span>
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Feature Value Props */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#006A4E] flex items-center justify-center font-bold text-xl mb-4">
              🇧🇩
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Authentic Visual Grammar</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Curated templates with national flag motifs, golden sun rays, floral wreaths, and traditional credit footers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl mb-4">
              ✍️
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Zero Bengali Spelling Errors</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Eliminates AI hallucinations by using server-side canvas rendering with authentic Kalpurush TrueType fonts.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-[#F42A41] flex items-center justify-center font-bold text-xl mb-4">
              🖨️
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">1200×1600px Print-Ready</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Exports sharp, high-resolution PNG images ready for physical paper posters, flex banners, and social sharing.
            </p>
          </div>
        </div>
      </section>

      {/* Template Selection Gallery Section */}
      <section id="templates-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest font-bold text-[#006A4E] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Template Catalog
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-3">
            Choose a Political Poster Theme
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Select a curated occasion template to start composing your customized print banner.
          </p>
        </div>

        {/* Occasion Filter Buttons */}
        <OccasionFilter
          selectedOccasion={selectedOccasion}
          onSelectOccasion={(occ) => setSelectedOccasion(occ)}
        />

        {/* Error State */}
        {error && (
          <div className="max-w-md mx-auto my-8 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
            <p className="text-sm text-red-700 font-medium mb-3">{error}</p>
            <button
              onClick={() => fetchTemplates(selectedOccasion)}
              className="px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition"
            >
              Retry Loading
            </button>
          </div>
        )}

        {/* Loading Skeleton Grid */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm animate-pulse">
                <div className="aspect-[3/4] bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-10 bg-gray-200 rounded-xl mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Template Cards Grid */}
        {!isLoading && !error && (
          <>
            {templates.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 mt-8">
                <p className="text-gray-500 text-sm">No templates found for this category.</p>
                <button
                  onClick={() => setSelectedOccasion('ALL')}
                  className="mt-3 text-xs font-semibold text-[#006A4E] hover:underline"
                >
                  View all templates
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {templates.map((template) => (
                  <TemplateCard key={template._id} template={template} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
