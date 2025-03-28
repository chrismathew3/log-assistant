"use client"

import React, { useState } from "react"
import { Command, Inbox } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@workspace/ui/components/sidebar"
import { useSearchLogs } from "@/hooks/useSearchLogs"
import { LogEntry } from "@workspace/prisma-postgres"
import { useGetLog } from "@/hooks/useGetLog"
import { useGetLogs } from "@/hooks/useGetLogs"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onSelectLog?: (log: LogEntry) => void
}

const navMain = [{ title: "Log Entries", icon: Inbox, isActive: true }]

export const AppSidebar = ({ onSelectLog, ...props }: AppSidebarProps) => {
  const [activeItem, setActiveItem] = useState(navMain[0])
  const [searchText, setSearchText] = useState("")
  const { setOpen } = useSidebar()
  const { data, error, isLoading } = useSearchLogs({ searchQuery: searchText })
  const {data: logData} = useGetLogs({page: 1, pageSize: 10});
  console.log(data);
  const logs = data?.items ?? logData?.items ?? []

  const handleNavItemClick = (item: typeof navMain[0]) => () => {
    setActiveItem(item)
    setOpen(true)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  const handleLogClick = (log: LogEntry) => () => {
    onSelectLog?.(log)
  }

  const renderNavItem = (item: typeof navMain[0]) => (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton
        tooltip={{ children: item.title, hidden: false }}
        onClick={handleNavItemClick(item)}
        isActive={activeItem?.title === item.title}
        className="px-2.5 md:px-2"
      >
        <item.icon />
        <span>{item.title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )

  const renderLogItem = (log: LogEntry) => (
    <button
      key={log.id}
      onClick={handleLogClick(log)}
      className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full text-left"
    >
      <div className="flex w-full items-center gap-2">
        <span className="font-medium">Log #{log.id}</span>
        <span className="ml-auto text-xs">{new Date(log.createdAt).toLocaleDateString()}</span>
      </div>
      <span className="line-clamp-2 w-full whitespace-break-spaces text-xs">
        {log.summary ?? "(No summary yet)"}
      </span>
    </button>
  )

  const logsList = logs.map(renderLogItem)

  return (
    <Sidebar collapsible="icon" className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row" {...props}>
      <Sidebar collapsible="none" className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="/">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Command className="size-4" />
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>{navMain.map(renderNavItem)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-base font-medium text-foreground">{activeItem?.title}</div>
          </div>
          <SidebarInput
            placeholder="Type to search logs..."
            value={searchText}
            onChange={handleSearchChange}
          />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {isLoading && <div className="p-4 text-sm text-muted-foreground">Loading logs...</div>}
              {error && (
                <div className="p-4 text-sm text-destructive">
                  Error loading logs: {(error as Error).message}
                </div>
              )}
              {logsList}
              {logs.length === 0 && !isLoading && !error && (
                <div className="p-4 text-sm text-muted-foreground">No logs found.</div>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  )
}
