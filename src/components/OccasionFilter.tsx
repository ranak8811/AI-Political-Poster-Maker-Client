'use client';

import React from 'react';

export interface FilterOption {
  key: string;
  label: string;
  bengaliSubtitle: string;
  icon: string;
}

const OCCASIONS: FilterOption[] = [
  { key: 'ALL', label: 'All Templates', bengaliSubtitle: 'সকল টেমপ্লেট', icon: '🌟' },
  { key: 'VICTORY_DAY', label: 'Victory Day', bengaliSubtitle: 'মহান বিজয় দিবস', icon: '🇧🇩' },
  { key: 'CAMPAIGN', label: 'Campaign', bengaliSubtitle: 'নির্বাচনী প্রচার', icon: '🗳️' },
  { key: 'MEMORIAL', label: 'Memorial', bengaliSubtitle: 'শোক ও শ্রদ্ধাঞ্জলি', icon: '🕊️' },
];

interface OccasionFilterProps {
  selectedOccasion: string;
  onSelectOccasion: (occasion: string) => void;
}

export default function OccasionFilter({
  selectedOccasion,
  onSelectOccasion,
}: OccasionFilterProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-4">
      {OCCASIONS.map((occasion) => {
        const isSelected = selectedOccasion === occasion.key;

        return (
          <button
            key={occasion.key}
            onClick={() => onSelectOccasion(occasion.key)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 shadow-sm ${
              isSelected
                ? 'bg-[#006A4E] text-white shadow-md ring-2 ring-emerald-700/50 scale-[1.02]'
                : 'bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-gray-200'
            }`}
          >
            <span>{occasion.icon}</span>
            <div className="flex flex-col text-left">
              <span className="font-semibold leading-tight">{occasion.label}</span>
              <span className={`text-[10px] leading-tight ${isSelected ? 'text-emerald-200' : 'text-gray-400'}`}>
                {occasion.bengaliSubtitle}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
