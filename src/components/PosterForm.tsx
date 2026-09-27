'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Template } from '@/types/template';
import PhotoUploadDropzone from './PhotoUploadDropzone';
import apiClient from '@/lib/api-client';

interface PosterFormProps {
  template: Template;
}

export default function PosterForm({ template }: PosterFormProps) {
  const router = useRouter();
  const { user, token } = useAuth();

  // Form input states
  const [candidateName, setCandidateName] = useState('');
  const [designation, setDesignation] = useState('');
  const [party, setParty] = useState('');
  const [locality, setLocality] = useState('');
  const [headline, setHeadline] = useState(template.layoutConfig?.defaultHeadline || '');
  const [creditLine, setCreditLine] = useState('প্রচারে: এলাকাবাসী ও দলীয় নেতাকর্মীবৃন্দ');

  // Photo URLs state (from Cloudinary)
  const [candidatePhotoUrl, setCandidatePhotoUrl] = useState('');
  const [leaderPhoto1Url, setLeaderPhoto1Url] = useState('');
  const [leaderPhoto2Url, setLeaderPhoto2Url] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Basic Validation
    if (!candidateName.trim()) {
      setFormError('Candidate name is required.');
      return;
    }

    if (!designation.trim()) {
      setFormError('Candidate designation is required.');
      return;
    }

    if (!party.trim()) {
      setFormError('Political party or organization is required.');
      return;
    }

    if (!headline.trim()) {
      setFormError('Poster headline is required.');
      return;
    }

    if (!candidatePhotoUrl) {
      setFormError('Please upload the candidate portrait photo.');
      return;
    }

    // Check if user is logged in
    if (!token) {
      setFormError('You must be signed in to generate a political poster. Please log in first.');
      return;
    }

    setIsSubmitting(true);

    // Collect all valid photo URLs
    const uploadedPhotoUrls: string[] = [candidatePhotoUrl];
    if (leaderPhoto1Url) uploadedPhotoUrls.push(leaderPhoto1Url);
    if (leaderPhoto2Url) uploadedPhotoUrls.push(leaderPhoto2Url);

    const payload = {
      templateId: template._id,
      formData: {
        name: candidateName.trim(),
        designation: designation.trim(),
        party: party.trim(),
        locality: locality.trim() || undefined,
        headline: headline.trim(),
        creditLine: creditLine.trim() || 'প্রচারে: এলাকাবাসী ও দলীয় নেতাকর্মীবৃন্দ',
      },
      uploadedPhotoUrls,
    };

    try {
      const data = await apiClient.post<any>('/api/v1/posters', payload);
      const posterId = data.posterId || data.poster?._id;

      if (data.success && posterId) {
        // Redirect to preview screen
        router.push(`/preview/${posterId}`);
      } else {
        setFormError(data.message || 'Failed to submit poster creation request.');
      }
    } catch (err: any) {
      console.error('Error creating poster:', err);
      setFormError(err.message || 'Failed to connect to the backend server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Validation Error Banner */}
      {formError && (
        <div className="p-4 bg-red-50 border-l-4 border-[#F42A41] rounded-r-xl shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="text-red-600 font-bold">⚠️</span>
            <p className="text-sm font-semibold text-red-700">{formError}</p>
          </div>
        </div>
      )}

      {/* Guest Notice if not logged in */}
      {!user && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between">
          <span>You are currently not logged in. You will need to log in to save and generate your poster.</span>
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="px-3 py-1 bg-amber-600 text-white font-semibold rounded hover:bg-amber-700 ml-3"
          >
            Sign In
          </button>
        </div>
      )}

      {/* Section 1: Candidate & Political Details */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/80 shadow-sm space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h3 className="text-lg font-bold text-gray-900">1. Political & Candidate Information</h3>
          <p className="text-xs text-gray-500 mt-1">
            Enter Bengali text for authentic political typography (e.g. নাম, পদবি, দল).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Candidate Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Candidate Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="e.g. আলহাজ্ব মোঃ তরিকুল ইসলাম"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#006A4E] focus:border-transparent outline-none text-gray-900 text-sm"
            />
          </div>

          {/* Designation */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Designation / Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="e.g. সাধারণ সম্পাদক, খিলগাঁও থানা"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#006A4E] focus:border-transparent outline-none text-gray-900 text-sm"
            />
          </div>

          {/* Party / Organization */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Political Party / Wing <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={party}
              onChange={(e) => setParty(e.target.value)}
              placeholder="e.g. বাংলাদেশ জাতীয়তাবাদী দল"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#006A4E] focus:border-transparent outline-none text-gray-900 text-sm"
            />
          </div>

          {/* Locality */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Locality / Constituency <span className="text-xs text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              placeholder="e.g. ঢাকা মহানগর দক্ষিণ / ওয়ার্ড নং-১"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#006A4E] focus:border-transparent outline-none text-gray-900 text-sm"
            />
          </div>
        </div>

        {/* Poster Headline */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Main Poster Headline <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="e.g. ১৬ই ডিসেম্বর মহান বিজয় দিবস সফল হোক"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#006A4E] focus:border-transparent outline-none text-gray-900 text-sm"
          />
        </div>

        {/* Credit Line */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Footer Credit Line <span className="text-xs text-gray-400 font-normal">(Printed by)</span>
          </label>
          <input
            type="text"
            value={creditLine}
            onChange={(e) => setCreditLine(e.target.value)}
            placeholder="e.g. প্রচারে: এলাকাবাসী ও দলীয় নেতাকর্মীবৃন্দ"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#006A4E] focus:border-transparent outline-none text-gray-900 text-sm"
          />
        </div>
      </div>

      {/* Section 2: Photo Uploads */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/80 shadow-sm space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h3 className="text-lg font-bold text-gray-900">2. Photo Uploads (Up to 3 Photos)</h3>
          <p className="text-xs text-gray-500 mt-1">
            Uploaded images are processed directly into Cloudinary and cropped into portrait frames.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Candidate Portrait (Required) */}
          <PhotoUploadDropzone
            label="Candidate Portrait"
            sublabel="Main prominence"
            required={true}
            value={candidatePhotoUrl}
            onChange={(url) => setCandidatePhotoUrl(url)}
          />

          {/* Top Leader 1 (Optional) */}
          <PhotoUploadDropzone
            label="Top Leader #1"
            sublabel="Top left slot (Optional)"
            required={false}
            value={leaderPhoto1Url}
            onChange={(url) => setLeaderPhoto1Url(url)}
          />

          {/* Top Leader 2 (Optional) */}
          <PhotoUploadDropzone
            label="Top Leader #2"
            sublabel="Top right slot (Optional)"
            required={false}
            value={leaderPhoto2Url}
            onChange={(url) => setLeaderPhoto2Url(url)}
          />
        </div>
      </div>

      {/* Submit Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-100 transition"
        >
          ← Change Template
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#006A4E] hover:bg-emerald-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Submitting Request...</span>
            </>
          ) : (
            <>
              <span>Generate Political Poster</span>
              <span>→</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
