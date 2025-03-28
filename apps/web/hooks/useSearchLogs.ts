import useSWR from 'swr';
import { fetcher } from './fetcher';
import type { PaginatedLogs } from './types';

interface UseSearchLogsParams {
  searchQuery: string;          
  page?: number;
  pageSize?: number;
}

export function useSearchLogs({ searchQuery, page = 1, pageSize = 10 }: UseSearchLogsParams) {
  const shouldFetch = searchQuery.trim().length > 0;

  const { data, error, isLoading, mutate } = useSWR<PaginatedLogs>(
    shouldFetch
      ? `/api/log/search?q=${encodeURIComponent(searchQuery)}&page=${page}&pageSize=${pageSize}`
      : null, 
    fetcher
  );

  return { data, error, isLoading, mutate };
}
