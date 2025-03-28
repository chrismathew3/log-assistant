"use client";

import React from "react";
import { Textarea } from "@workspace/ui/components/textarea";
import { Label } from "@workspace/ui/components/label";
import { Button } from "@workspace/ui/components/button";
import { Send } from "lucide-react";
// Example: Adjust to your actual import path
import { useCreateLog } from "../hooks/useCreateLog";

export function ChatSection() {
  const [logsInput, setLogsInput] = React.useState("");

  // This is where you'd import your createLog mutation hook
  const { createLog, data, error, isMutating } = useCreateLog();

  /**
   * Named function to handle text changes.
   */
  function handleLogsChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setLogsInput(event.target.value);
  }

  /**
   * Named function to handle sending logs.
   */
  function handleSendLogs() {
    if (!logsInput.trim()) return;

    // Call our SWR mutation or fetch request here
    createLog(logsInput)
      .then(() => {
        // Optionally clear input or handle success
        setLogsInput("");
      })
      .catch((err) => {
        // Handle error or display feedback
        console.error("Error creating log:", err);
      });
  }

  return (
    <div className="flex items-center justify-center h-full p-4">
      <div className="flex flex-col items-center justify-center gap-5">
        <Label className="text-xl font-bold" htmlFor="logs">
          What can I help you with?
        </Label>
        <div className="min-w-[40rem] flex flex-col gap-2 relative">
          <Textarea
            id="logs"
            placeholder="Paste your logs here"
            value={logsInput}
            onChange={handleLogsChange} // Named function
            className="pr-12"
          />
          <p className="text-sm text-muted-foreground">
            Powered by LLMs to generate insights
          </p>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            disabled={!logsInput.trim() || isMutating}
            onClick={handleSendLogs} // Named function
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {error && (
          <p className="text-sm text-destructive">
            Error creating log: {(error as Error).message}
          </p>
        )}
        {data && (
          <p className="text-sm text-primary">
            Log created! (ID: {data.id})
          </p>
        )}
      </div>
    </div>
  );
}
