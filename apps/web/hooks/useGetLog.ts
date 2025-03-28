import useSWR from 'swr';
import { fetcher } from './fetcher';
import type { LogEntry } from '@workspace/prisma-postgres';

export function useGetLog(id?: number) {
  const shouldFetch = typeof id === 'number' && !Number.isNaN(id);

  const { data, error, isLoading, mutate } = useSWR<LogEntry>(
    shouldFetch ? `/api/log/${id}` : null,
    fetcher
  );

  return {
    data,
    error,
    isLoading,
    mutate
  };
}