'use client';

import React from 'react';
import Link from 'next/link';
import { Template } from '@/types/template';

interface TemplateCardProps {
  template: Template;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  const { title, slug, occasionType, layoutConfig, thumbnailUrl } = template;
  const photoSlotsCount = layoutConfig?.photoSlots?.length || 1;

  // Occasion Badge Styling
  const badgeConfig: Record<string, { bg: string; text: string; label: string }> = {
    VICTORY_DAY: { bg: 'bg-emerald-100 border-emerald-300', text: 'text-emerald-800', label: 'Victory Day' },
    CAMPAIGN: { bg: 'bg-blue-100 border-blue-300', text: 'text-blue-800', label: 'Election Campaign' },
    MEMORIAL: { bg: 'bg-gray-100 border-gray-300', text: 'text-gray-800', label: 'Memorial Tribute' },
    GREETINGS: { bg: 'bg-amber-100 border-amber-300', text: 'text-amber-800', label: 'Seasonal Greetings' },
  };

  const badge = badgeConfig[occasionType] || { bg: 'bg-gray-100', text: 'text-gray-800', label: occasionType };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300 flex flex-col">
      {/* Poster Thumbnail / Preview Header */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-900 flex items-center justify-center">
        {/* Poster Visual Simulation Preview */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105 opacity-85"
          style={{ backgroundImage: `url(${thumbnailUrl})` }}
        />

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${badge.bg} ${badge.text}`}>
            {badge.label}
          </span>
          <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2 py-0.5 rounded-md border border-white/20">
            {photoSlotsCount} Photo {photoSlotsCount > 1 ? 'Slots' : 'Slot'}
          </span>
        </div>

        {/* Center Poster Headline Preview */}
        <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
          <h3 className="font-bold text-xl sm:text-2xl text-white drop-shadow-md mb-1 leading-tight font-sans">
            {title}
          </h3>
          {layoutConfig?.defaultHeadline && (
            <p className="text-xs text-gray-200 line-clamp-2 leading-relaxed opacity-90">
              &quot;{layoutConfig.defaultHeadline}&quot;
            </p>
          )}
        </div>
      </div>

      {/* Card Body & Configuration Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="flex items-center justify-between text-xs text-gray-500">
          {/* Theme Color Palette Dots */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[11px] font-medium text-gray-400">Theme:</span>
            {layoutConfig?.primaryColor && (
              <span
                className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-inner"
                style={{ backgroundColor: layoutConfig.primaryColor }}
                title="Primary Color"
              />
            )}
            {layoutConfig?.secondaryColor && (
              <span
                className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-inner"
                style={{ backgroundColor: layoutConfig.secondaryColor }}
                title="Secondary Color"
              />
            )}
            {layoutConfig?.accentColor && (
              <span
                className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-inner"
                style={{ backgroundColor: layoutConfig.accentColor }}
                title="Accent Color"
              />
            )}
          </div>

          <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            1200×1600 Print Ready
          </span>
        </div>

        {/* Select Action Button */}
        <Link
          href={`/create?template=${slug}`}
          className="w-full py-2.5 px-4 rounded-xl bg-[#006A4E] hover:bg-emerald-800 text-white font-semibold text-sm shadow hover:shadow-md transition-all flex items-center justify-center space-x-1.5 group-hover:bg-[#F42A41]"
        >
          <span>Use This Template</span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </div>
  );
}
