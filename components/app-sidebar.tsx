"use client"

import { useRouter } from "next/navigation"
import {
  Calendar,
  Home,
  Map,
  MessageSquare,
  Settings,
  BarChart3,
  PenToolIcon as Tool,
  LogOut,
  User,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

interface AppSidebarProps {
  user: { username: string; role: string } | null
}

export function AppSidebar({ user }: AppSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  // Define navigation items based on user role
  const getNavItems = () => {
    const items = [
      {
        title: "Tableau de bord",
        url: "/dashboard",
        icon: Home,
        roles: ["firefighter", "technician", "municipal", "civil_protection"],
      },
      {
        title: "Carte",
        url: "/dashboard/map",
        icon: Map,
        roles: ["firefighter", "technician", "municipal", "civil_protection"],
      },
      {
        title: "Maintenance",
        url: "/dashboard/maintenance",
        icon: Tool,
        roles: ["technician", "municipal"],
      },
      {
        title: "Messagerie",
        url: "/dashboard/messages",
        icon: MessageSquare,
        roles: ["firefighter", "technician", "municipal", "civil_protection"],
      },
      {
        title: "Planification",
        url: "/dashboard/planning",
        icon: Calendar,
        roles: ["municipal", "civil_protection"],
      },
      {
        title: "Statistiques",
        url: "/dashboard/analytics",
        icon: BarChart3,
        roles: ["municipal", "civil_protection"],
      },
      {
        title: "Paramètres",
        url: "/dashboard/settings",
        icon: Settings,
        roles: ["municipal"],
      },
    ]

    // Filter items based on user role
    return items.filter((item) => user && item.roles.includes(user.role))
  }

  const navItems = getNavItems()

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            H
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">SIG Hydrants</span>
            <span className="text-xs text-muted-foreground">v0.1</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="text-sm font-medium">{user?.username}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} title="Déconnexion">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
