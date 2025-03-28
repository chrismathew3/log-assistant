"use client";

import React from "react";
import { Button } from "@workspace/ui/components/button";
import type { LogEntry } from "@workspace/prisma-postgres"; // or from your shared package

interface LogDetailsProps {
  log: LogEntry;
  onDeselect?: () => void;
}

export function LogDetails({ log, onDeselect }: LogDetailsProps) {
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

      {/* If you have the raw logs from S3, you might show them here */}
      {/* <div className="mt-4 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold">Raw Logs:</h3>
        <pre className="text-xs whitespace-pre-wrap">{rawLogs}</pre>
      </div> */}
    </div>
  );
}
