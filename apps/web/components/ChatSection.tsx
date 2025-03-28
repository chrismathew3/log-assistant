"use client"
import React, { useState, ChangeEvent } from "react"
import { Textarea } from "@workspace/ui/components/textarea"
import { Label } from "@workspace/ui/components/label"
import { Button } from "@workspace/ui/components/button"
import { Send } from "lucide-react"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { useCreateLog } from "@/hooks/useCreateLog"

interface ChatSectionProps {
  onLogCreated?: (id: number) => void
}

export const ChatSection = ({ onLogCreated }: ChatSectionProps) => {
  const [logsInput, setLogsInput] = useState("")
  const { createLog, data, error, isMutating } = useCreateLog()

  const handleLogsChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setLogsInput(event.target.value)
  }

  const handleSendLogs = () => {
    if (!logsInput.trim()) return
    createLog(logsInput)
      .then((newLog) => {
        setLogsInput("")
        onLogCreated?.(newLog.id) 
      })
      .catch(err => console.error("Error creating log:", err))
  }

  if (isMutating) {
    return (
      <div className="p-4 space-y-2">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    )
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
            onChange={handleLogsChange}
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
            onClick={handleSendLogs}
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
  )
}
