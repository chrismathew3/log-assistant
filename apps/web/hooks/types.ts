import type { LogEntry } from '@workspace/prisma-postgres';

/**
 * The shape returned by paginated list endpoints: /api/log and /api/log/search
 */
export interface PaginatedLogs {
  items: LogEntry[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface UseSearchLogsParams {
  searchQuery: string;
  page?: number;
  pageSize?: number;
}

export interface UseGetLogsParams {
  page?: number;
  pageSize?: number;
}

export interface CreateLogArg {
  rawText: string;
}

export interface LogEntryWithUrl extends LogEntry {
  presignedUrl?: string | null;
}

