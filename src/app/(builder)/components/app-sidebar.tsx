"use client"

import * as React from "react"
import { GalleryVerticalEnd, PlusIcon, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/registry/new-york/ui/sidebar"
import { siteConfig } from "@/lib/config"
import { useBuilder } from "./builder-provider"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {
    sessions,
    activeSessionId,
    isReady,
    createSession,
    deleteSession,
  } = useBuilder()
  const router = useRouter()

  const handleCreateSession = () => {
    const session = createSession()
    router.push(`/builder/${session.id}`)
  }

  const handleDeleteSession = (sessionId: string) => {
    const wasActive = sessionId === activeSessionId
    const nextSession = deleteSession(sessionId)
    if (wasActive && nextSession) {
      router.push(`/builder/${nextSession.id}`)
    }
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Sidekick</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Builder</SidebarGroupLabel>
          <SidebarMenu>
            {siteConfig.widgetNavItems.map((item) => {
              const Icon = item.icon
              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <a href={item.href} className="font-medium">
                      <Icon className="size-4" />
                      {item.label}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
          <SidebarGroupAction
            onClick={handleCreateSession}
            aria-label="Create new chat"
            title="Create new chat"
          >
            <PlusIcon className="size-4" />
          </SidebarGroupAction>
          <SidebarMenu>
            {!isReady && (
              <SidebarMenuItem>
                <SidebarMenuButton disabled>Loading chats...</SidebarMenuButton>
              </SidebarMenuItem>
            )}
            {sessions.map((session) => (
              <SidebarMenuItem key={session.id}>
                <SidebarMenuButton
                  asChild
                  isActive={session.id === activeSessionId}
                >
                  <Link href={`/builder/${session.id}`}>
                    <span className="truncate">{session.title}</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuAction
                  aria-label="Delete chat"
                  onClick={() => handleDeleteSession(session.id)}
                  showOnHover
                  title="Delete chat"
                >
                  <Trash2 />
                </SidebarMenuAction>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
