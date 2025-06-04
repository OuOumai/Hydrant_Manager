"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { hydrantsData } from "@/data/hydrants"
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Droplet,
  Gauge,
  MapPin,
  Wrench,
} from "lucide-react"

export default function DashboardPage() {
  // Calculer les statistiques à partir des données des hydrants
  const stats = {
    total: hydrantsData.length,
    functional: hydrantsData.filter(h => h.status === "functional").length,
    maintenance: hydrantsData.filter(h => h.status === "maintenance").length,
    outOfOrder: hydrantsData.filter(h => h.status === "outOfOrder").length,
    averagePressure: (
      hydrantsData.reduce((acc, h) => acc + h.pressure, 0) / hydrantsData.length
    ).toFixed(1),
    averageFlowRate: Math.round(
      hydrantsData.reduce((acc, h) => acc + h.flowRate, 0) / hydrantsData.length
    ),
  }

  // Calculer les pourcentages pour les statistiques
  const functionalPercentage = ((stats.functional / stats.total) * 100).toFixed(0)
  const maintenancePercentage = ((stats.maintenance / stats.total) * 100).toFixed(0)
  const outOfOrderPercentage = ((stats.outOfOrder / stats.total) * 100).toFixed(0)

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Tableau de Bord
        </h1>
        <p className="text-muted-foreground">Vue d'ensemble du réseau d'hydrants</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total des hydrants */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total des hydrants</p>
                <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
              </div>
              <Droplet className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        {/* Hydrants fonctionnels */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Fonctionnels</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-green-700">{stats.functional}</p>
                  <p className="text-sm text-green-600">{functionalPercentage}%</p>
                </div>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        {/* Hydrants en maintenance */}
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">En maintenance</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-yellow-700">{stats.maintenance}</p>
                  <p className="text-sm text-yellow-600">{maintenancePercentage}%</p>
                </div>
              </div>
              <Wrench className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        {/* Hydrants hors service */}
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Hors service</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-red-700">{stats.outOfOrder}</p>
                  <p className="text-sm text-red-600">{outOfOrderPercentage}%</p>
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques détaillées */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Pression moyenne */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pression moyenne</CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averagePressure} bar</div>
            <p className="text-xs text-muted-foreground">
              Moyenne calculée sur tous les hydrants fonctionnels
            </p>
          </CardContent>
        </Card>

        {/* Débit moyen */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Débit moyen</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageFlowRate} L/min</div>
            <p className="text-xs text-muted-foreground">
              Capacité moyenne du réseau
            </p>
          </CardContent>
        </Card>

        {/* Distribution géographique */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distribution par ville</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Tanger</span>
                <span className="text-sm font-medium">
                  {hydrantsData.filter(h => h.id.startsWith("H-TNG")).length} hydrants
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Tétouan</span>
                <span className="text-sm font-medium">
                  {hydrantsData.filter(h => h.id.startsWith("H-TET")).length} hydrants
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Al Hoceima</span>
                <span className="text-sm font-medium">
                  {hydrantsData.filter(h => h.id.startsWith("H-AHC")).length} hydrants
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
