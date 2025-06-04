"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Droplet,
  Info,
  Calendar,
  Wrench,
  AlertTriangle,
  ArrowLeft,
  FileText,
  Gauge,
  Shield
} from "lucide-react"
import { hydrantsData } from "@/data/hydrants"
import type { Hydrant } from "@/types/hydrant"

interface HydrantDisplay {
  id: string
  type: string
  status: "operational" | "maintenance" | "out-of-service"
  address: string
  lastInspection: string
  nextInspection: string
  pressure: string
  diameter: string
  installationDate: string
  notes: string
  lat: number
  lng: number
  history: {
    type: "inspection" | "maintenance" | "issue"
    title: string
    date: string
    description: string
  }[]
}

// Convertir les données des hydrants au format d'affichage
const convertHydrantData = (hydrant: Hydrant): HydrantDisplay => {
  let displayStatus: "operational" | "maintenance" | "out-of-service"
  if (hydrant.status === "functional") {
    displayStatus = "operational"
  } else if (hydrant.status === "outOfOrder") {
    displayStatus = "out-of-service"
  } else {
    displayStatus = "maintenance"
  }

  return {
    id: hydrant.id,
    type: hydrant.type,
    status: displayStatus,
    address: hydrant.address,
    lastInspection: hydrant.lastInspection,
    nextInspection: hydrant.nextInspection,
    pressure: `${hydrant.pressure} bars`,
    diameter: "100mm",
    installationDate: hydrant.history[hydrant.history.length - 1]?.date || "Non spécifié",
    notes: hydrant.history[0]?.description || "Aucune note disponible",
    lat: hydrant.lat,
    lng: hydrant.lng,
    history: hydrant.history
  }
}

// Créer le dictionnaire des hydrants
const MOCK_HYDRANTS: Record<string, HydrantDisplay> = Object.fromEntries(
  hydrantsData.map(h => [h.id, convertHydrantData(h)])
)

export default function HydrantDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [hydrant, setHydrant] = useState<HydrantDisplay | null>(null)

  useEffect(() => {
    const hydrantData = MOCK_HYDRANTS[params.id]
    if (hydrantData) {
      setHydrant(hydrantData)
    }
  }, [params.id])

  if (!hydrant) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold">Hydrant non trouvé</h2>
            <p className="text-gray-600 mt-2">L'hydrant demandé n'existe pas.</p>
            <Button className="mt-4" onClick={() => router.back()}>
              Retour
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-100 text-green-800 border-green-200"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "out-of-service":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "operational":
        return "Opérationnel"
      case "maintenance":
        return "En maintenance"
      case "out-of-service":
        return "Hors service"
      default:
        return status
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Button
        variant="outline"
        className="mb-4"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour
      </Button>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600">
            <div className="flex justify-between items-center">
              <div className="text-white">
                <p className="text-sm font-medium">Code de l'hydrant</p>
                <h1 className="text-2xl font-bold">{hydrant.id}</h1>
              </div>
              <Badge className={`${getStatusColor(hydrant.status)} text-sm px-3 py-1`}>
                {getStatusText(hydrant.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Type</p>
                    <p className="text-gray-600">{hydrant.type}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Localisation</p>
                    <p className="text-gray-600">{hydrant.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Gauge className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Pression</p>
                    <p className="text-gray-600">{hydrant.pressure}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Droplet className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Diamètre</p>
                    <p className="text-gray-600">{hydrant.diameter}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Date d'installation</p>
                    <p className="text-gray-600">{hydrant.installationDate}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Wrench className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Dernière inspection</p>
                    <p className="text-gray-600">{hydrant.lastInspection}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Prochaine inspection</p>
                    <p className="text-gray-600">{hydrant.nextInspection}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium">Notes</p>
                  <p className="text-gray-600 mt-1">{hydrant.notes}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 