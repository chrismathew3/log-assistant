import useSWR from "swr";
import { fetcher } from "./fetcher";
import { LOG_SEARCH_ENDPOINT } from "../lib/constants";
import type { PaginatedLogs, UseSearchLogsParams } from "./types";


export const useSearchLogs = ({ searchQuery, page = 1, pageSize = 10 }: UseSearchLogsParams) => {
  const hasQuery = searchQuery.trim().length > 0;
  const endpoint = hasQuery
    ? `${LOG_SEARCH_ENDPOINT}?q=${encodeURIComponent(searchQuery)}&page=${page}&pageSize=${pageSize}`
    : null;

  const { data, error, isLoading, mutate } = useSWR<PaginatedLogs>(endpoint, fetcher);
  return { data, error, isLoading, mutate };
};
