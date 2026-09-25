import React from 'react';
import Link from 'next/link';

export default function Home() {
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
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#F42A41] hover:bg-red-700 text-white font-bold text-base shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
            >
              <span>Get Started Free</span>
              <span>→</span>
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base border border-white/20 transition-colors flex items-center justify-center"
            >
              <span>Sign In to Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Feature Value Props */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#006A4E] flex items-center justify-center font-bold text-xl mb-4">
              🇧🇩
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Authentic Visual Grammar</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Curated templates with national flag motifs, golden sun rays, floral wreaths, and traditional credit footers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl mb-4">
              ✍️
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Zero Bengali Spelling Errors</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Eliminates AI hallucinations by using server-side canvas rendering with authentic Kalpurush TrueType fonts.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
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
    </div>
  );
}
