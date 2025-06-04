"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplet, Info, History, PenToolIcon as Tool, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Hydrant } from "@/types/hydrant"
import { MaintenanceForm } from "@/components/maintenance-form"
import { useToast } from "@/hooks/use-toast"

interface HydrantDetailsProps {
  hydrant: Hydrant
  onClose: () => void
}

export function HydrantDetails({ hydrant, onClose }: HydrantDetailsProps) {
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false)
  const { toast } = useToast()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "functional":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Fonctionnel
          </Badge>
        )
      case "maintenance":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            En maintenance
          </Badge>
        )
      case "outOfOrder":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Hors service
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleReportIssue = () => {
    toast({
      title: "Signalement envoyé",
      description: `Un problème a été signalé pour l'hydrant ${hydrant.id}`,
    })
  }

  const handleStartMaintenance = () => {
    setShowMaintenanceForm(true)
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Hydrant {hydrant.id}</h3>
            <p className="text-sm text-muted-foreground">{hydrant.address}</p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(hydrant.status)}
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {showMaintenanceForm ? (
          <MaintenanceForm
            hydrant={hydrant}
            onCancel={() => setShowMaintenanceForm(false)}
            onComplete={() => {
              setShowMaintenanceForm(false)
              onClose()
            }}
          />
        ) : (
          <Tabs defaultValue="info" className="h-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">
                <Info className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Informations</span>
              </TabsTrigger>
              <TabsTrigger value="data">
                <Droplet className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Données</span>
              </TabsTrigger>
              <TabsTrigger value="history">
                <History className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Historique</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <p>{hydrant.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Capacité</p>
                  <p>{hydrant.capacity} L/min</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Dernière inspection</p>
                  <p>{hydrant.lastInspection}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Prochaine inspection</p>
                  <p>{hydrant.nextInspection}</p>
                </div>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Code QR</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="h-32 w-32 bg-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-500">QR Code</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Données en temps réel</CardTitle>
                  <CardDescription>Dernière mise à jour: il y a 5 minutes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Pression</span>
                      <span>{hydrant.pressure} bar</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Débit</span>
                      <span>{hydrant.flowRate} L/min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Niveau d'eau</span>
                      <span>{hydrant.waterLevel}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Température</span>
                      <span>{hydrant.temperature}°C</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4 mt-4">
              <div className="space-y-4">
                {hydrant.history.map((event, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="mt-0.5">
                      {event.type === "inspection" && <Info className="h-4 w-4 text-blue-500" />}
                      {event.type === "maintenance" && <Tool className="h-4 w-4 text-yellow-500" />}
                      {event.type === "issue" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.date}</p>
                      <p className="text-sm mt-1">{event.description}</p>
                      {index < hydrant.history.length - 1 && <Separator className="my-2" />}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>

      {!showMaintenanceForm && (
        <div className="border-t p-4">
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="w-full" onClick={handleReportIssue}>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Signaler un problème
            </Button>
            <Button variant="default" className="w-full" onClick={handleStartMaintenance}>
              <Tool className="h-4 w-4 mr-2" />
              Lancer une intervention
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
