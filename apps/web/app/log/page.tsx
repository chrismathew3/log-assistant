"use client";

import * as React from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@workspace/ui/components/breadcrumb";
import { Separator } from "@workspace/ui/components/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@workspace/ui/components/sidebar";

import { LogDetails } from "../../components/LogDetails";
import { LogEntry } from "@workspace/prisma-postgres";
import { ChatSection } from "@/components/ChatSection";
import { AppSidebar } from "@/components/Sidebar";


export default function LogsPage() {
  const [selectedLog, setSelectedLog] = React.useState<LogEntry | null>(null);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar onSelectLog={(log) => setSelectedLog(log)} />

      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          {selectedLog &&
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">All Inboxes</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{selectedLog.id}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          }
        </header>

        <div className="flex flex-1 flex-col p-4">
          {!selectedLog ? (
            <ChatSection />
          ) : (
            <LogDetails log={selectedLog} onDeselect={() => setSelectedLog(null)} />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
