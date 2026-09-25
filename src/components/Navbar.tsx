'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#006A4E] text-white shadow-lg border-b border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-9 h-9 rounded-full bg-[#F42A41] flex items-center justify-center shadow-md font-bold text-lg text-white border-2 border-white group-hover:scale-105 transition-transform">
                ★
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-wide text-white leading-tight">
                  AI Poster Maker
                </span>
                <span className="text-[10px] text-emerald-200 tracking-wider uppercase font-medium">
                  Political Poster Studio
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className="text-emerald-100 hover:text-white hover:bg-emerald-800/60 px-3 py-2 rounded-md transition-colors"
            >
              Templates
            </Link>
            <Link
              href="/create"
              className="text-emerald-100 hover:text-white hover:bg-emerald-800/60 px-3 py-2 rounded-md transition-colors"
            >
              Create Poster
            </Link>
            {user && (
              <Link
                href="/history"
                className="text-emerald-100 hover:text-white hover:bg-emerald-800/60 px-3 py-2 rounded-md transition-colors"
              >
                My Posters
              </Link>
            )}
          </div>

          {/* User Authentication Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              <div className="w-20 h-8 bg-emerald-800 animate-pulse rounded-md" />
            ) : user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-emerald-800/80 px-3 py-1.5 rounded-full border border-emerald-700">
                  <div className="w-6 h-6 rounded-full bg-[#F42A41] text-xs flex items-center justify-center font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-emerald-100 max-w-[140px] truncate">
                    {user.name}
                  </span>
                  {user.role === 'admin' && (
                    <span className="bg-amber-400 text-amber-950 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      ADMIN
                    </span>
                  )}
                </div>
                <button
                  onClick={logout}
                  className="bg-emerald-950/70 hover:bg-[#F42A41] text-xs font-semibold px-3 py-2 rounded-md transition-colors border border-emerald-700 hover:border-[#F42A41]"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-emerald-100 hover:text-white px-3 py-2 rounded-md transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-[#F42A41] hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-md shadow transition-all transform hover:-translate-y-0.5"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-emerald-100 hover:text-white p-2 rounded-md focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-emerald-950 px-4 pt-2 pb-4 space-y-2 border-t border-emerald-800">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-emerald-100 hover:text-white py-2"
          >
            Templates
          </Link>
          <Link
            href="/create"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-emerald-100 hover:text-white py-2"
          >
            Create Poster
          </Link>
          {user && (
            <Link
              href="/history"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-emerald-100 hover:text-white py-2"
            >
              My Posters
            </Link>
          )}

          <div className="pt-3 border-t border-emerald-800/80">
            {user ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-emerald-200">{user.name}</span>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="bg-[#F42A41] text-xs font-semibold px-3 py-1.5 rounded"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-3 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center bg-emerald-800 py-2 rounded text-sm font-semibold"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center bg-[#F42A41] py-2 rounded text-sm font-semibold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
