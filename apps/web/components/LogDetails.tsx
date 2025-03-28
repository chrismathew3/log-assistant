"use client"
import React from "react"
import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"
import type { LogEntry } from "@workspace/prisma-postgres"

interface LogEntryWithUrl extends LogEntry {
  presignedUrl?: string | null
}

interface LogDetailsProps {
  log?: LogEntryWithUrl | null
  isLoading?: boolean
  onDeselect?: () => void
}

export const LogDetails = ({ log, isLoading, onDeselect }: LogDetailsProps) => {
  if (isLoading) {
    return (
      <div className="p-4 space-y-2">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    )
  }

  if (!log) {
    return (
      <div className="p-4">
        <Button variant="outline" onClick={onDeselect}>
          ← Back to Logs
        </Button>
        <p className="mt-4">Log not found.</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <Button variant="outline" onClick={onDeselect}>
        ← Back to Logs
      </Button>
      <h2 className="text-xl font-bold">Log #{log.id}</h2>
      <p className="text-sm text-muted-foreground">
        Created: {new Date(log.createdAt).toLocaleString()}
      </p>
      <div className="mt-4 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold">LLM Summary:</h3>
        <p>{log.summary ?? "(No summary yet)"}</p>
      </div>
      {log.presignedUrl && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold">Raw Logs:</h3>
          <a
            href={log.presignedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-500 hover:text-blue-600"
          >
            View Raw Logs
          </a>
        </div>
      )}
    </div>
  )
}
