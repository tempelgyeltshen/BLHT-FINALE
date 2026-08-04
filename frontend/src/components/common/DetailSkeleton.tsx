import React from 'react';
import { motion } from 'motion/react';

// Reusable Shimmer Bone
export const SkeletonBone: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-stone-300/60 relative overflow-hidden rounded-xl animate-pulse ${className}`}>
    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-stone-100/50 to-transparent animate-[shimmer_1.8s_infinite]" />
  </div>
);

// Package Detail Skeleton
export const PackageDetailSkeleton: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-[#fcf8f2] min-h-screen pb-20 pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6"
    >
      {/* Back button & Breadcrumb Skeleton */}
      <div className="flex items-center justify-between pb-2">
        <SkeletonBone className="h-10 w-36 rounded-xl" />
        <SkeletonBone className="h-8 w-24 rounded-full" />
      </div>

      {/* Hero Banner Skeleton */}
      <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden shadow-md">
        <SkeletonBone className="w-full h-full" />
        <div className="absolute bottom-6 left-6 right-6 space-y-3">
          <SkeletonBone className="h-6 w-32 rounded-full" />
          <SkeletonBone className="h-10 w-3/4 max-w-xl rounded-xl" />
          <div className="flex items-center gap-3">
            <SkeletonBone className="h-5 w-24 rounded-md" />
            <SkeletonBone className="h-5 w-28 rounded-md" />
            <SkeletonBone className="h-5 w-20 rounded-md" />
          </div>
        </div>
      </div>

      {/* Main Content Grid: Left 2/3, Right 1/3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        
        {/* Left Column (Details, Tabs, Itinerary) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tabs Bar */}
          <div className="flex gap-3 pb-2 border-b border-amber-900/10">
            <SkeletonBone className="h-11 w-32 rounded-xl" />
            <SkeletonBone className="h-11 w-32 rounded-xl" />
            <SkeletonBone className="h-11 w-32 rounded-xl" />
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <SkeletonBone className="h-24 rounded-2xl" />
            <SkeletonBone className="h-24 rounded-2xl" />
            <SkeletonBone className="h-24 rounded-2xl" />
          </div>

          {/* Overview Section */}
          <div className="bg-[#f5eee4]/60 p-6 rounded-3xl space-y-3 border border-[#e8ddce]">
            <SkeletonBone className="h-6 w-40 rounded-lg" />
            <SkeletonBone className="h-4 w-full rounded-md" />
            <SkeletonBone className="h-4 w-11/12 rounded-md" />
            <SkeletonBone className="h-4 w-4/5 rounded-md" />
          </div>

          {/* Itinerary Days Stack */}
          <div className="space-y-4">
            <SkeletonBone className="h-7 w-48 rounded-lg mb-4" />
            {[1, 2, 3, 4].map(day => (
              <div key={day} className="bg-white/80 p-5 rounded-2xl border border-amber-900/10 flex gap-4">
                <SkeletonBone className="w-12 h-12 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <SkeletonBone className="h-5 w-1/2 rounded-md" />
                  <SkeletonBone className="h-4 w-full rounded-md" />
                  <SkeletonBone className="h-4 w-3/4 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (Sidebar Booking Card) */}
        <div className="space-y-6">
          <div className="bg-[#3b2314]/90 p-6 rounded-3xl space-y-5 text-white shadow-xl">
            <SkeletonBone className="h-7 w-36 bg-amber-950/40 rounded-lg" />
            <SkeletonBone className="h-10 w-28 bg-amber-950/40 rounded-xl" />
            <div className="space-y-3 pt-2">
              <SkeletonBone className="h-4 w-full bg-amber-950/40 rounded-md" />
              <SkeletonBone className="h-4 w-5/6 bg-amber-950/40 rounded-md" />
              <SkeletonBone className="h-4 w-4/6 bg-amber-950/40 rounded-md" />
            </div>
            <SkeletonBone className="h-12 w-full bg-amber-500/40 rounded-2xl mt-4" />
          </div>

          <div className="bg-[#f5eee4]/60 p-5 rounded-2xl border border-[#e8ddce] space-y-3">
            <SkeletonBone className="h-5 w-32 rounded-md" />
            <SkeletonBone className="h-16 w-full rounded-xl" />
          </div>
        </div>

      </div>
    </motion.div>
  );
};

// Hotel Detail Skeleton
export const HotelDetailSkeleton: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-[#fcf8f2] min-h-screen pb-20 pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6"
    >
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <SkeletonBone className="h-10 w-36 rounded-xl" />
        <SkeletonBone className="h-6 w-32 rounded-full" />
      </div>

      {/* Hotel Photo Gallery Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-80 sm:h-96">
        <div className="md:col-span-2 h-full">
          <SkeletonBone className="w-full h-full rounded-3xl" />
        </div>
        <div className="hidden md:flex flex-col gap-4 h-full">
          <SkeletonBone className="w-full h-1/2 rounded-2xl" />
          <SkeletonBone className="w-full h-1/2 rounded-2xl" />
        </div>
      </div>

      {/* Hotel Header Info */}
      <div className="bg-[#f5eee4]/70 p-6 sm:p-8 rounded-3xl border border-[#e8ddce] space-y-4">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map(i => (
            <SkeletonBone key={i} className="w-5 h-5 rounded-full" />
          ))}
          <SkeletonBone className="h-5 w-28 rounded-md ml-2" />
        </div>
        <SkeletonBone className="h-9 w-2/3 max-w-lg rounded-xl" />
        <div className="flex items-center gap-4 flex-wrap">
          <SkeletonBone className="h-5 w-40 rounded-md" />
          <SkeletonBone className="h-5 w-36 rounded-md" />
        </div>
      </div>

      {/* Amenities & Suites */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <SkeletonBone className="h-7 w-48 rounded-lg" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map(a => (
              <SkeletonBone key={a} className="h-12 rounded-xl" />
            ))}
          </div>

          <SkeletonBone className="h-7 w-52 rounded-lg mt-6" />
          <div className="space-y-4">
            {[1, 2].map(s => (
              <div key={s} className="bg-white/80 p-5 rounded-2xl border border-amber-900/10 flex flex-col sm:flex-row gap-4">
                <SkeletonBone className="w-full sm:w-48 h-32 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <SkeletonBone className="h-6 w-1/2 rounded-md" />
                  <SkeletonBone className="h-4 w-full rounded-md" />
                  <SkeletonBone className="h-4 w-4/5 rounded-md" />
                  <SkeletonBone className="h-10 w-36 rounded-xl mt-3" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#3b2314]/90 p-6 rounded-3xl space-y-5 text-white shadow-xl">
            <SkeletonBone className="h-6 w-40 bg-amber-950/40 rounded-lg" />
            <SkeletonBone className="h-10 w-32 bg-amber-950/40 rounded-xl" />
            <SkeletonBone className="h-12 w-full bg-amber-500/40 rounded-2xl mt-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Catalog / Grid View Skeleton (for Luxury, Hotels, Brochures, etc.)
export const CatalogSkeleton: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-[#fcf8f2] min-h-screen pb-20 pt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8"
    >
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <SkeletonBone className="h-5 w-32 mx-auto rounded-full" />
        <SkeletonBone className="h-10 w-3/4 mx-auto rounded-xl" />
        <SkeletonBone className="h-4 w-full mx-auto rounded-md" />
      </div>

      {/* Filter / Search bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-[#f5eee4] p-4 rounded-2xl border border-[#e8ddce]">
        <SkeletonBone className="h-10 w-64 rounded-xl" />
        <div className="flex items-center gap-2">
          <SkeletonBone className="h-10 w-24 rounded-xl" />
          <SkeletonBone className="h-10 w-24 rounded-xl" />
        </div>
      </div>

      {/* 3x2 Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-white rounded-3xl border border-amber-900/10 overflow-hidden shadow-xs space-y-4 p-4">
            <SkeletonBone className="w-full h-52 rounded-2xl" />
            <SkeletonBone className="h-6 w-3/4 rounded-md" />
            <SkeletonBone className="h-4 w-full rounded-md" />
            <SkeletonBone className="h-4 w-2/3 rounded-md" />
            <div className="flex items-center justify-between pt-2 border-t border-stone-100">
              <SkeletonBone className="h-6 w-20 rounded-md" />
              <SkeletonBone className="h-10 w-28 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
