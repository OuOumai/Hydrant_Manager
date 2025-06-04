"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState("month")

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-700"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Statistiques</h1>
          <p className="text-muted-foreground">Analyse des données des hydrants</p>
        </div>
        <div className="mt-4 flex items-center gap-2 md:mt-0">
          <Label htmlFor="period-select" className="mr-2">
            Période:
          </Label>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger id="period-select" className="w-[180px]">
              <SelectValue placeholder="Sélectionner une période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">7 derniers jours</SelectItem>
              <SelectItem value="month">30 derniers jours</SelectItem>
              <SelectItem value="quarter">3 derniers mois</SelectItem>
              <SelectItem value="year">12 derniers mois</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Taux de disponibilité</CardTitle>
                <CardDescription>Hydrants fonctionnels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">81.9%</div>
                <p className="text-xs text-muted-foreground">+2.1% par rapport au mois précédent</p>
                <div className="mt-4 h-2 w-full rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-green-500" style={{ width: "81.9%" }}></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Temps moyen d'intervention</CardTitle>
                <CardDescription>Délai de réparation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.3 jours</div>
                <p className="text-xs text-muted-foreground">-0.5 jour par rapport au mois précédent</p>
                <div className="mt-4 h-2 w-full rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-blue-500" style={{ width: "65%" }}></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Incidents signalés</CardTitle>
                <CardDescription>Problèmes reportés</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">27</div>
                <p className="text-xs text-muted-foreground">+5 par rapport au mois précédent</p>
                <div className="mt-4 h-2 w-full rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-red-500" style={{ width: "45%" }}></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Inspections effectuées</CardTitle>
                <CardDescription>Contrôles réalisés</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">+12 par rapport au mois précédent</p>
                <div className="mt-4 h-2 w-full rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-purple-500" style={{ width: "78%" }}></div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Répartition des statuts</CardTitle>
                <CardDescription>État actuel des hydrants</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square w-full max-w-md mx-auto">
                  <div className="relative h-full w-full rounded-full">
                    {/* Simulated pie chart */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-[80%] w-[80%] rounded-full border-8 border-transparent bg-white"></div>
                    </div>
                    <svg viewBox="0 0 100 100" className="h-full w-full rotate-[-90deg]">
                      {/* Green segment - 82% */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#22c55e"
                        strokeWidth="20"
                        strokeDasharray={`${82 * 2.51} ${100 * 2.51 - 82 * 2.51}`}
                      />
                      {/* Yellow segment - 7% */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#eab308"
                        strokeWidth="20"
                        strokeDasharray={`${7 * 2.51} ${100 * 2.51 - 7 * 2.51}`}
                        strokeDashoffset={`${-(82) * 2.51}`}
                      />
                      {/* Red segment - 11% */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#ef4444"
                        strokeWidth="20"
                        strokeDasharray={`${11 * 2.51} ${100 * 2.51 - 11 * 2.51}`}
                        strokeDashoffset={`${-(82 + 7) * 2.51}`}
                      />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium">Fonctionnels</span>
                    </div>
                    <p className="text-2xl font-bold">82%</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <span className="text-sm font-medium">En maintenance</span>
                    </div>
                    <p className="text-2xl font-bold">7%</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <span className="text-sm font-medium">Hors service</span>
                    </div>
                    <p className="text-2xl font-bold">11%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques de maintenance</CardTitle>
              <CardDescription>Analyse des interventions de maintenance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* KPIs de maintenance */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Temps moyen de réparation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">3.2 heures</div>
                      <p className="text-xs text-muted-foreground">-15% par rapport au mois précédent</p>
                      <div className="mt-4 h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-green-500" style={{ width: "65%" }}></div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Taux de résolution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">94.7%</div>
                      <p className="text-xs text-muted-foreground">+2.3% par rapport au mois précédent</p>
                      <div className="mt-4 h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-blue-500" style={{ width: "94.7%" }}></div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Coût moyen</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">1,250 MAD</div>
                      <p className="text-xs text-muted-foreground">-120 MAD par rapport au mois précédent</p>
                      <div className="mt-4 h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-purple-500" style={{ width: "72%" }}></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Graphique à barres - Types d'interventions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Types d'interventions</CardTitle>
                    <CardDescription>Répartition par catégorie de maintenance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      {/* Graphique à barres simulé */}
                      <div className="flex h-[240px] items-end justify-around gap-2">
                        <div className="flex flex-col items-center">
                          <div className="h-[192px] w-16 bg-blue-500 rounded-t-md"></div>
                          <p className="mt-2 text-sm">Remplacement</p>
                          <p className="text-xs text-muted-foreground">42%</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="h-[144px] w-16 bg-green-500 rounded-t-md"></div>
                          <p className="mt-2 text-sm">Réparation</p>
                          <p className="text-xs text-muted-foreground">32%</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="h-[72px] w-16 bg-yellow-500 rounded-t-md"></div>
                          <p className="mt-2 text-sm">Inspection</p>
                          <p className="text-xs text-muted-foreground">16%</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="h-[36px] w-16 bg-red-500 rounded-t-md"></div>
                          <p className="mt-2 text-sm">Urgence</p>
                          <p className="text-xs text-muted-foreground">8%</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="h-[9px] w-16 bg-purple-500 rounded-t-md"></div>
                          <p className="mt-2 text-sm">Autre</p>
                          <p className="text-xs text-muted-foreground">2%</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Graphique linéaire - Évolution dans le temps */}
                <Card>
                  <CardHeader>
                    <CardTitle>Évolution des interventions</CardTitle>
                    <CardDescription>Nombre d'interventions par mois</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      {/* Graphique linéaire simulé */}
                      <div className="relative h-[240px] w-full">
                        <div className="absolute inset-0 flex flex-col justify-between border-l border-b">
                          {/* Lignes horizontales */}
                          <div className="w-full border-t border-dashed border-gray-200"></div>
                          <div className="w-full border-t border-dashed border-gray-200"></div>
                          <div className="w-full border-t border-dashed border-gray-200"></div>
                          <div className="w-full border-t border-dashed border-gray-200"></div>
                        </div>

                        {/* Ligne de tendance */}
                        <svg
                          className="absolute inset-0 h-full w-full"
                          viewBox="0 0 100 100"
                          preserveAspectRatio="none"
                        >
                          <polyline
                            points="0,70 20,65 40,75 60,40 80,50 100,30"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2"
                          />
                          <polyline
                            points="0,80 20,85 40,82 60,75 80,70 100,65"
                            fill="none"
                            stroke="#22c55e"
                            strokeWidth="2"
                            strokeDasharray="4"
                          />
                        </svg>

                        {/* Légende */}
                        <div className="absolute bottom-[-30px] left-0 right-0 flex justify-between text-xs text-muted-foreground">
                          <span>Jan</span>
                          <span>Fév</span>
                          <span>Mar</span>
                          <span>Avr</span>
                          <span>Mai</span>
                          <span>Juin</span>
                        </div>

                        {/* Légende des lignes */}
                        <div className="absolute top-2 right-2 flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <div className="h-1 w-5 bg-blue-500"></div>
                            <span className="text-xs">Préventive</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-1 w-5 bg-green-500 border-dashed"></div>
                            <span className="text-xs">Corrective</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tableau des dernières interventions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Dernières interventions</CardTitle>
                    <CardDescription>Interventions récentes sur les hydrants</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="p-2 text-left font-medium">Date</th>
                            <th className="p-2 text-left font-medium">Hydrant</th>
                            <th className="p-2 text-left font-medium">Type</th>
                            <th className="p-2 text-left font-medium">Technicien</th>
                            <th className="p-2 text-left font-medium">Statut</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-2">12/06/2023</td>
                            <td className="p-2">H-TNG-042</td>
                            <td className="p-2">Remplacement valve</td>
                            <td className="p-2">Mohammed A.</td>
                            <td className="p-2">
                              <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                                Complété
                              </span>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2">10/06/2023</td>
                            <td className="p-2">H-TET-018</td>
                            <td className="p-2">Inspection annuelle</td>
                            <td className="p-2">Karim B.</td>
                            <td className="p-2">
                              <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                                Complété
                              </span>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2">08/06/2023</td>
                            <td className="p-2">H-TNG-103</td>
                            <td className="p-2">Réparation fuite</td>
                            <td className="p-2">Youssef M.</td>
                            <td className="p-2">
                              <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                                En cours
                              </span>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2">05/06/2023</td>
                            <td className="p-2">H-AHC-007</td>
                            <td className="p-2">Remplacement complet</td>
                            <td className="p-2">Hassan T.</td>
                            <td className="p-2">
                              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">Planifié</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-2">03/06/2023</td>
                            <td className="p-2">H-TNG-056</td>
                            <td className="p-2">Urgence - Accident</td>
                            <td className="p-2">Équipe d'urgence</td>
                            <td className="p-2">
                              <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                                Complété
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents">
          <Card>
            <CardHeader>
              <CardTitle>Analyse des incidents</CardTitle>
              <CardDescription>Détails des problèmes signalés</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* KPIs des incidents */}
                <div className="grid gap-4 md:grid-cols-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Incidents ce mois</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">27</div>
                      <p className="text-xs text-muted-foreground">+5 par rapport au mois précédent</p>
                      <div className="mt-4 h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-red-500" style={{ width: "45%" }}></div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Temps de résolution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">4.8 heures</div>
                      <p className="text-xs text-muted-foreground">-1.2h par rapport au mois précédent</p>
                      <div className="mt-4 h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-green-500" style={{ width: "75%" }}></div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Taux de résolution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">89.3%</div>
                      <p className="text-xs text-muted-foreground">+3.1% par rapport au mois précédent</p>
                      <div className="mt-4 h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-blue-500" style={{ width: "89.3%" }}></div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Incidents critiques</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">3</div>
                      <p className="text-xs text-muted-foreground">-2 par rapport au mois précédent</p>
                      <div className="mt-4 h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-orange-500" style={{ width: "30%" }}></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {/* Graphique à barres - Types d'incidents */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Types d'incidents</CardTitle>
                      <CardDescription>Répartition par catégorie</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[280px] w-full">
                        <div className="flex h-[220px] items-end justify-around gap-2">
                          <div className="flex flex-col items-center">
                            <div className="h-[132px] w-12 bg-red-500 rounded-t-md"></div>
                            <p className="mt-2 text-xs">Fuite</p>
                            <p className="text-xs text-muted-foreground">37%</p>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="h-[88px] w-12 bg-orange-500 rounded-t-md"></div>
                            <p className="mt-2 text-xs">Pression</p>
                            <p className="text-xs text-muted-foreground">25%</p>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="h-[66px] w-12 bg-yellow-500 rounded-t-md"></div>
                            <p className="mt-2 text-xs">Valve</p>
                            <p className="text-xs text-muted-foreground">19%</p>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="h-[44px] w-12 bg-blue-500 rounded-t-md"></div>
                            <p className="mt-2 text-xs">Accès</p>
                            <p className="text-xs text-muted-foreground">12%</p>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="h-[22px] w-12 bg-purple-500 rounded-t-md"></div>
                            <p className="mt-2 text-xs">Autre</p>
                            <p className="text-xs text-muted-foreground">7%</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Graphique en secteurs - Gravité des incidents */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Gravité des incidents</CardTitle>
                      <CardDescription>Répartition par niveau de gravité</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-square w-full max-w-[250px] mx-auto">
                        <div className="relative h-full w-full rounded-full">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-[70%] w-[70%] rounded-full border-8 border-transparent bg-white"></div>
                          </div>
                          <svg viewBox="0 0 100 100" className="h-full w-full rotate-[-90deg]">
                            {/* Faible - 52% */}
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="transparent"
                              stroke="#22c55e"
                              strokeWidth="20"
                              strokeDasharray={`${52 * 2.51} ${100 * 2.51 - 52 * 2.51}`}
                            />
                            {/* Moyenne - 33% */}
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="transparent"
                              stroke="#eab308"
                              strokeWidth="20"
                              strokeDasharray={`${33 * 2.51} ${100 * 2.51 - 33 * 2.51}`}
                              strokeDashoffset={`${-(52) * 2.51}`}
                            />
                            {/* Élevée - 15% */}
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="transparent"
                              stroke="#ef4444"
                              strokeWidth="20"
                              strokeDasharray={`${15 * 2.51} ${100 * 2.51 - 15 * 2.51}`}
                              strokeDashoffset={`${-(52 + 33) * 2.51}`}
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div className="flex items-center justify-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                            <span className="text-xs font-medium">Faible</span>
                          </div>
                          <p className="text-lg font-bold">52%</p>
                        </div>
                        <div>
                          <div className="flex items-center justify-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                            <span className="text-xs font-medium">Moyenne</span>
                          </div>
                          <p className="text-lg font-bold">33%</p>
                        </div>
                        <div>
                          <div className="flex items-center justify-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-red-500"></div>
                            <span className="text-xs font-medium">Élevée</span>
                          </div>
                          <p className="text-lg font-bold">15%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Graphique linéaire - Évolution des incidents */}
                <Card>
                  <CardHeader>
                    <CardTitle>Évolution des incidents</CardTitle>
                    <CardDescription>Nombre d'incidents par mois et par gravité</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <div className="relative h-[240px] w-full">
                        <div className="absolute inset-0 flex flex-col justify-between border-l border-b">
                          <div className="w-full border-t border-dashed border-gray-200"></div>
                          <div className="w-full border-t border-dashed border-gray-200"></div>
                          <div className="w-full border-t border-dashed border-gray-200"></div>
                          <div className="w-full border-t border-dashed border-gray-200"></div>
                        </div>

                        <svg
                          className="absolute inset-0 h-full w-full"
                          viewBox="0 0 100 100"
                          preserveAspectRatio="none"
                        >
                          {/* Incidents totaux */}
                          <polyline
                            points="0,60 20,55 40,65 60,45 80,50 100,40"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="3"
                          />
                          {/* Incidents critiques */}
                          <polyline
                            points="0,85 20,80 40,90 60,75 80,70 100,65"
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="2"
                            strokeDasharray="4"
                          />
                          {/* Incidents résolus */}
                          <polyline
                            points="0,70 20,65 40,75 60,55 80,60 100,50"
                            fill="none"
                            stroke="#22c55e"
                            strokeWidth="2"
                          />
                        </svg>

                        <div className="absolute bottom-[-30px] left-0 right-0 flex justify-between text-xs text-muted-foreground">
                          <span>Jan</span>
                          <span>Fév</span>
                          <span>Mar</span>
                          <span>Avr</span>
                          <span>Mai</span>
                          <span>Juin</span>
                        </div>

                        <div className="absolute top-2 right-2 flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <div className="h-1 w-5 bg-blue-500"></div>
                            <span className="text-xs">Total</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-1 w-5 bg-red-500 border-dashed"></div>
                            <span className="text-xs">Critiques</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-1 w-5 bg-green-500"></div>
                            <span className="text-xs">Résolus</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Répartition géographique */}
                <Card>
                  <CardHeader>
                    <CardTitle>Répartition géographique</CardTitle>
                    <CardDescription>Incidents par ville de la région</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Tanger</p>
                          <p className="text-sm text-muted-foreground">15 incidents</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">56%</p>
                          <div className="h-2 w-20 rounded-full bg-muted mt-1">
                            <div className="h-2 rounded-full bg-red-500" style={{ width: "56%" }}></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Tétouan</p>
                          <p className="text-sm text-muted-foreground">8 incidents</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">30%</p>
                          <div className="h-2 w-20 rounded-full bg-muted mt-1">
                            <div className="h-2 rounded-full bg-orange-500" style={{ width: "30%" }}></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Al Hoceima</p>
                          <p className="text-sm text-muted-foreground">4 incidents</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">14%</p>
                          <div className="h-2 w-20 rounded-full bg-muted mt-1">
                            <div className="h-2 rounded-full bg-yellow-500" style={{ width: "14%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tableau des incidents récents */}
                <Card>
                  <CardHeader>
                    <CardTitle>Incidents récents</CardTitle>
                    <CardDescription>Derniers incidents signalés</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="p-2 text-left font-medium">Date</th>
                            <th className="p-2 text-left font-medium">Hydrant</th>
                            <th className="p-2 text-left font-medium">Type</th>
                            <th className="p-2 text-left font-medium">Gravité</th>
                            <th className="p-2 text-left font-medium">Signalé par</th>
                            <th className="p-2 text-left font-medium">Statut</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-2">15/06/2023</td>
                            <td className="p-2">H-TNG-089</td>
                            <td className="p-2">Fuite importante</td>
                            <td className="p-2">
                              <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-800">Élevée</span>
                            </td>
                            <td className="p-2">Citoyen</td>
                            <td className="p-2">
                              <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                                En cours
                              </span>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2">14/06/2023</td>
                            <td className="p-2">H-TET-025</td>
                            <td className="p-2">Valve bloquée</td>
                            <td className="p-2">
                              <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                                Moyenne
                              </span>
                            </td>
                            <td className="p-2">Pompiers</td>
                            <td className="p-2">
                              <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">Résolu</span>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2">13/06/2023</td>
                            <td className="p-2">H-TNG-156</td>
                            <td className="p-2">Pression faible</td>
                            <td className="p-2">
                              <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">Faible</span>
                            </td>
                            <td className="p-2">Inspection</td>
                            <td className="p-2">
                              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">Planifié</span>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2">12/06/2023</td>
                            <td className="p-2">H-AHC-012</td>
                            <td className="p-2">Accès obstrué</td>
                            <td className="p-2">
                              <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                                Moyenne
                              </span>
                            </td>
                            <td className="p-2">Patrouille</td>
                            <td className="p-2">
                              <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">Résolu</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-2">10/06/2023</td>
                            <td className="p-2">H-TNG-203</td>
                            <td className="p-2">Fuite mineure</td>
                            <td className="p-2">
                              <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">Faible</span>
                            </td>
                            <td className="p-2">Citoyen</td>
                            <td className="p-2">
                              <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">Résolu</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
