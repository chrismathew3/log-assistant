import useSWRMutation from 'swr/mutation';
import type { LogEntry } from '@workspace/prisma-postgres';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

interface CreateLogArg {
  rawText: string;
}

async function createLogFetcher(
  url: string,
  { arg }: { arg: CreateLogArg }
): Promise<LogEntry> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rawText: arg.rawText })
  });

  if (!res.ok) {
    throw new Error(`Create log failed with status ${res.status}`);
  }
  return (await res.json()) as LogEntry;
}



export function useCreateLog() {
  const { data, error, isMutating, trigger } = useSWRMutation(
    `${BASE_URL}/api/log`,
    createLogFetcher
  );

  const createLog = (rawText: string) => {
    return trigger({ rawText });
  };

  return {
    createLog,
    data,
    error,
    isMutating,
  };
}