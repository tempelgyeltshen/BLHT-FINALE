import { useCallback, useMemo, useState } from 'react';

export interface UsePaginationResult<T> {
  currentPage: number;
  totalPages: number;
  /** The current page's slice of `items`. */
  pageItems: T[];
  goToPage: (page: number) => void;
  goToFirstPage: () => void;
}

/**
 * Reusable pagination state for list views. Clamps the current page whenever
 * the list shrinks (deletions/filtering) so the view never lands on an empty page.
 */
export function usePagination<T>(items: T[], pageSize = 8): UsePaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const pageItems = useMemo(
    () => items.slice((safePage - 1) * pageSize, safePage * pageSize),
    [items, safePage, pageSize]
  );

  const goToPage = useCallback(
    (page: number) => setCurrentPage(Math.min(Math.max(1, page), totalPages)),
    [totalPages]
  );
  const goToFirstPage = useCallback(() => setCurrentPage(1), []);

  return { currentPage: safePage, totalPages, pageItems, goToPage, goToFirstPage };
}
