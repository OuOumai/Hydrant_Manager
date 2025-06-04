// Update the app name to reflect the new region
import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SIG App - Gestion des Hydrants - Tanger-Tétouan-Al Hoceima",
    short_name: "SIG Hydrants",
    description:
      "Application de gestion des hydrants pour les pompiers et techniciens de la région Tanger-Tétouan-Al Hoceima",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#3b82f6",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
