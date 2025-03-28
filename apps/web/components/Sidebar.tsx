"use client"
import React, { useState, ChangeEvent } from "react"
import { Command, Inbox, ChevronLeft, ChevronRight } from "lucide-react"
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
import { Button } from "@workspace/ui/components/button"
import { useSearchLogs } from "@/hooks/useSearchLogs"
import { useGetLogs } from "@/hooks/useGetLogs"
import type { LogEntry } from "@workspace/prisma-postgres"
import { Skeleton } from "@workspace/ui/components/skeleton"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onSelectLog?: (logId: number) => void
}

const navMain = [{ title: "Log Entries", icon: Inbox }]

export const AppSidebar = ({ onSelectLog, ...props }: AppSidebarProps) => {
  const [activeItem, setActiveItem] = useState(navMain[0])
  const [searchText, setSearchText] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 5
  const { setOpen } = useSidebar()

  const { data: searchData, error: searchError, isLoading: searchLoading } = useSearchLogs({
    searchQuery: searchText,
    page,
    pageSize,
  })

  const { data: logsData, error: logsError, isLoading: logsLoading } = useGetLogs({
    page,
    pageSize,
  })

  const logs = searchText.trim().length > 0
    ? searchData?.items ?? []
    : logsData?.items ?? []

  const totalCount = searchText.trim().length > 0
    ? searchData?.totalCount ?? 0
    : logsData?.totalCount ?? 0

  const isLoading = searchText.trim().length > 0 ? searchLoading : logsLoading
  const error = searchText.trim().length > 0 ? searchError : logsError

  const totalPages = Math.ceil(totalCount / pageSize) || 1

  const handleNavItemClick = (item: typeof navMain[0]) => () => {
    setActiveItem(item)
    setOpen(true)
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPage(1)
    setSearchText(e.target.value)
  }

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1)
  }

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1)
  }

  const handleLogClick = (log: LogEntry) => () => {
    onSelectLog?.(log.id)
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
      <div className="flex flex-col w-full items-left gap-2">
        <span className="font-medium">Log #{log.id}</span>
        <span className=" text-xs">
          {new Date(log.createdAt).toLocaleDateString()}
        </span>
      </div>
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
              <SidebarMenu>
                {navMain.map(renderNavItem)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-base font-medium text-foreground">
              {activeItem?.title}
            </div>
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
              {isLoading && (
                <div className="px-4 py-2 space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex flex-col space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  ))}
                </div>
              )}
              {error && (
                <div className="p-4 text-sm text-destructive">
                  Error loading logs: {(error as Error).message}
                </div>
              )}
              {logsList}
              {logs.length === 0 && !isLoading && !error && (
                <div className="p-4 text-sm text-muted-foreground">No logs found.</div>
              )}
              {totalPages > 1 && (
                <div className="flex items-center justify-center w-full p-2 gap-4">
                  <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={page <= 1}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm">
                    Page {page} of {totalPages}
                  </span>
                  <Button variant="outline" size="sm" onClick={handleNextPage} disabled={page >= totalPages}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  )
};
