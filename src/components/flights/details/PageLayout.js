"use client";

/**
 * Page Layout Wrapper
 * Provides consistent layout structure for flight details pages
 */
export default function PageLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}

