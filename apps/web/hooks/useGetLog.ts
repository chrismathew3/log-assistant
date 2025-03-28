import useSWR from "swr"
import { fetcher } from "./fetcher"
import { LOG_ENDPOINT } from "@/lib/constants"
import { LogEntryWithUrl } from "./types"


export const useGetLog = (id?: number) => {
  const hasValidId = typeof id === "number" && !Number.isNaN(id)
  const endpoint = hasValidId ? `${LOG_ENDPOINT}/${id}` : null

  const { data, error, isLoading, mutate } = useSWR<LogEntryWithUrl>(endpoint, fetcher)

  return { data, error, isLoading, mutate }
}