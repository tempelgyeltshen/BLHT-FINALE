import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/** Reusable pagination with prev/next + numbered page buttons. */

const getPageNumbers = (currentPage: number, totalPages: number): number[] => {
  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
};

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center gap-1.5 pt-4">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </Button>

      {pages.map(page => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
            page === currentPage
              ? 'bg-amber-950 text-amber-100 shadow-xs'
              : 'bg-white text-stone-700 hover:bg-amber-100 border border-amber-200'
          }`}
        >
          {page}
        </button>
      ))}

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
};
