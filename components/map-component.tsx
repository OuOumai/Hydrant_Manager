"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { Hydrant } from "@/types/hydrant"

interface MapComponentProps {
  hydrants: Hydrant[]
  onHydrantClick: (hydrant: Hydrant) => void
  userLocation: [number, number] | null
}

const MapComponent = ({ hydrants, onHydrantClick, userLocation }: MapComponentProps) => {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.LayerGroup | null>(null)
  const userMarkerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    if (!mapRef.current) {
      // Initialiser la carte centrée sur la région Tanger-Tétouan-Al Hoceima
      mapRef.current = L.map("map", {
        center: [35.5518, -5.6],
        zoom: 10,
        zoomControl: true,
        attributionControl: true
      })

      // Ajouter la couche OpenStreetMap
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current)

      // Créer un groupe de couches pour les marqueurs
      markersRef.current = L.layerGroup().addTo(mapRef.current)
    }

    // Nettoyer la carte lors du démontage du composant
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Mettre à jour les marqueurs lorsque les hydrants changent
  useEffect(() => {
    if (mapRef.current && markersRef.current) {
      // Effacer les marqueurs existants
      markersRef.current.clearLayers()

      // Ajouter les nouveaux marqueurs
      hydrants.forEach((hydrant) => {
        const markerColor = getMarkerColor(hydrant.status)
        
        const hydrantIcon = L.divIcon({
          className: "custom-div-icon",
          html: `<div style="background-color: ${markerColor}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        })

        const marker = L.marker([hydrant.lat, hydrant.lng], {
          icon: hydrantIcon,
          title: `${hydrant.id} - ${hydrant.address}`
        }).addTo(markersRef.current!)

        // Ajouter un popup avec les informations de base
        marker.bindPopup(`
          <strong>${hydrant.id}</strong><br>
          ${hydrant.address}<br>
          <em>${hydrant.type}</em>
        `)

        marker.on("click", () => {
          onHydrantClick(hydrant)
        })
      })
    }
  }, [hydrants, onHydrantClick])

  // Mettre à jour le marqueur de position de l'utilisateur
  useEffect(() => {
    if (mapRef.current) {
      // Supprimer le marqueur utilisateur existant
      if (userMarkerRef.current) {
        userMarkerRef.current.remove()
        userMarkerRef.current = null
      }

      // Ajouter le nouveau marqueur utilisateur si la position est disponible
      if (userLocation) {
        const userIcon = L.divIcon({
          className: "custom-div-icon",
          html: `<div style="background-color: #3b82f6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        })

        userMarkerRef.current = L.marker(userLocation, {
          icon: userIcon,
          title: "Votre position"
        }).addTo(mapRef.current)

        // Centrer la carte sur la position de l'utilisateur avec un zoom approprié
        mapRef.current.setView(userLocation, 15)
      }
    }
  }, [userLocation])

  return <div id="map" className="h-full w-full relative" />
}

function getMarkerColor(status: string): string {
  switch (status) {
    case "functional":
      return "#22c55e" // vert
    case "maintenance":
      return "#eab308" // jaune
    case "outOfOrder":
      return "#ef4444" // rouge
    default:
      return "#3b82f6" // bleu
  }
}

export default MapComponent
