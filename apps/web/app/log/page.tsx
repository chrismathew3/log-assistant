"use client"

import React, { useState } from "react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@workspace/ui/components/breadcrumb"
import { Separator } from "@workspace/ui/components/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@workspace/ui/components/sidebar"
import { AppSidebar } from "@/components/Sidebar"
import { ChatSection } from "@/components/ChatSection"
import { LogDetails } from "@/components/LogDetails"
import { useGetLog } from "@/hooks/useGetLog"

const LogsPage = () => {
  const [selectedLogId, setSelectedLogId] = useState<number | null>(null)
  
  const { data: selectedLog, isLoading: isLogLoading } = useGetLog(selectedLogId || undefined)

  const handleSidebarSelect = (logId: number) => {
    setSelectedLogId(logId)
  }

  const handleNewLogCreated = (newLogId: number) => {
    setSelectedLogId(newLogId)
  }

  return (
    <SidebarProvider style={{ "--sidebar-width": "350px" } as React.CSSProperties}>
      <AppSidebar onSelectLog={handleSidebarSelect} />
      <SidebarInset>
        <header className="sticky top-0 flex items-center gap-2 border-b bg-background p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          {selectedLog && (
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  All Logs
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{selectedLog.id}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </header>
        <div className="flex flex-1 flex-col p-4">
          {!selectedLogId ? (
            <ChatSection onLogCreated={handleNewLogCreated} />
          ) : (
            <LogDetails
              log={selectedLog}
              isLoading={isLogLoading}
              onDeselect={() => setSelectedLogId(null)}
            />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default LogsPage
