"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Layers, MapPin } from "lucide-react"
import { HydrantDetails } from "@/components/hydrant-details"
import { hydrantsData } from "@/data/hydrants"
import type { Hydrant } from "@/types/hydrant"

// Dynamically import the Map component to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-700"></div>
    </div>
  ),
})

export default function MapPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedHydrant, setSelectedHydrant] = useState<Hydrant | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [filteredHydrants, setFilteredHydrants] = useState(hydrantsData)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Filter hydrants based on search query and status filter
    const filtered = hydrantsData.filter((hydrant) => {
      const matchesSearch =
        searchQuery === "" ||
        hydrant.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hydrant.address.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || hydrant.status === statusFilter

      return matchesSearch && matchesStatus
    })

    setFilteredHydrants(filtered)
  }, [searchQuery, statusFilter])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInputRef.current) {
      setSearchQuery(searchInputRef.current.value)
    }
  }

  const handleHydrantClick = (hydrant: Hydrant) => {
    setSelectedHydrant(hydrant)
  }

  const handleCloseDetails = () => {
    setSelectedHydrant(null)
  }

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.error("Error getting user location:", error)
        },
      )
    } else {
      console.error("Geolocation is not supported by this browser.")
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="border-b p-4 bg-white z-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-xl font-bold">Carte des hydrants - Région Tanger-Tétouan-Al Hoceima</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                placeholder="Rechercher par ID ou adresse..."
                className="w-full pl-8 md:w-[250px]"
                defaultValue={searchQuery}
              />
            </form>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="functional">Fonctionnel</SelectItem>
                <SelectItem value="maintenance">En maintenance</SelectItem>
                <SelectItem value="outOfOrder">Hors service</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={getUserLocation} title="Ma position">
              <MapPin className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" title="Couches">
              <Layers className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="relative flex-1 flex">
        <div className={`transition-all duration-300 ${selectedHydrant ? "w-2/3" : "w-full"}`}>
          <MapComponent hydrants={filteredHydrants} onHydrantClick={handleHydrantClick} userLocation={userLocation} />
        </div>
        {selectedHydrant && (
          <div className="w-1/3 border-l bg-white">
            <HydrantDetails hydrant={selectedHydrant} onClose={handleCloseDetails} />
          </div>
        )}
      </div>
    </div>
  )
}
