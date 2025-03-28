import useSWR from "swr";
import { fetcher } from "./fetcher";
import { LOG_ENDPOINT } from "../lib/constants";
import type { PaginatedLogs, UseGetLogsParams } from "./types";



export const useGetLogs = ({ page = 1, pageSize = 10 }: UseGetLogsParams) => {
  const endpoint = `${LOG_ENDPOINT}?page=${page}&pageSize=${pageSize}`;
  const { data, error, isLoading, mutate } = useSWR<PaginatedLogs>(endpoint, fetcher);
  return { data, error, isLoading, mutate };
};