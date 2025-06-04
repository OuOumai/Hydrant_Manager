import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "sonner"

// Update the metadata to reflect the new region
export const metadata: Metadata = {
  title: "SIG App - Gestion des Hydrants - Tanger-Tétouan-Al Hoceima",
  description:
    "Application de gestion des hydrants pour les pompiers et techniciens de la région Tanger-Tétouan-Al Hoceima",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Toaster />
    </html>
  )
}
