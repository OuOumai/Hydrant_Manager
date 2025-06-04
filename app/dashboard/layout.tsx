"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<{ username: string; role: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const userStr = localStorage.getItem("user")
    if (!userStr) {
      router.push("/")
      return
    }

    try {
      const userData = JSON.parse(userStr)
      setUser(userData)

      // Show welcome toast
      toast({
        title: `Bienvenue, ${userData.username}`,
        description: `Vous êtes connecté en tant que ${getRoleName(userData.role)}`,
      })
    } catch (error) {
      router.push("/")
    } finally {
      setLoading(false)
    }
  }, [router, toast])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-700"></div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar user={user} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
      <Toaster />
    </SidebarProvider>
  )
}

function getRoleName(role: string): string {
  switch (role) {
    case "firefighter":
      return "Pompier"
    case "technician":
      return "Technicien"
    case "municipal":
      return "Gestionnaire Municipal"
    case "civil_protection":
      return "Protection Civile"
    default:
      return role
  }
}
