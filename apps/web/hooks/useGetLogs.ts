import useSWR from 'swr';
import { fetcher } from './fetcher';
import type { PaginatedLogs } from './types';

interface UseGetLogsParams {
  page?: number;
  pageSize?: number;
}

export function useGetLogs({ page = 1, pageSize = 10 }: UseGetLogsParams) {
  const { data, error, isLoading, mutate } = useSWR<PaginatedLogs>(
    `/api/log?page=${page}&pageSize=${pageSize}`,
    fetcher
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}