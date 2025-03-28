import useSWRMutation from "swr/mutation";
import { BASE_URL, LOG_ENDPOINT } from "../lib/constants";
import type { LogEntry } from "@workspace/prisma-postgres";
import { CreateLogArg } from "./types";


const createLogFetcher = async (url: string, { arg }: { arg: CreateLogArg }): Promise<LogEntry> => {
  const res = await fetch(`${BASE_URL}${url}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rawText: arg.rawText }),
  });
  if (!res.ok) {
    throw new Error(`Create log failed with status ${res.status}`);
  }
  return res.json() as Promise<LogEntry>;
};

export const useCreateLog = () => {
  const { data, error, isMutating, trigger } = useSWRMutation(LOG_ENDPOINT, createLogFetcher);

  const createLog = (rawText: string) => trigger({ rawText });

  return { createLog, data, error, isMutating };
};
