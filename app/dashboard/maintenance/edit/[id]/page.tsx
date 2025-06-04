"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "lucide-react"
import { toast } from "sonner"

interface MaintenanceTask {
  id: string
  hydrantId: string
  title: string
  description: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "pending" | "in-progress" | "completed" | "cancelled"
  assignedTo: string
  location: string
  scheduledDate: string
  estimatedDuration: string
  progress: number
  type: "inspection" | "repair" | "replacement" | "emergency"
}

export default function EditMaintenancePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<MaintenanceTask | null>(null)

  useEffect(() => {
    // Charger les données depuis le localStorage
    const savedTasks = JSON.parse(localStorage.getItem('maintenanceTasks') || '[]')
    const taskToEdit = savedTasks.find((task: MaintenanceTask) => task.id === params.id)
    
    if (taskToEdit) {
      setFormData(taskToEdit)
    } else {
    
      const mockTask: MaintenanceTask = {
        id: params.id,
        hydrantId: "H-TNG-042",
        title: "Remplacement valve principale",
        description: "Valve défectueuse détectée lors de l'inspection. Remplacement urgent nécessaire.",
        priority: "urgent",
        status: "in-progress",
        assignedTo: "Mohammed Alami",
        location: "Avenue Mohammed VI, Tanger",
        scheduledDate: "2023-06-15",
        estimatedDuration: "4h",
        progress: 65,
        type: "replacement"
      }
      setFormData(mockTask)
    }
    setLoading(false)
  }, [params.id])

  const handleChange = (field: keyof MaintenanceTask, value: string) => {
    if (formData) {
      setFormData({
        ...formData,
        [field]: value,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (!formData) return

      // Récupérer les tâches existantes
      const existingTasks = JSON.parse(localStorage.getItem('maintenanceTasks') || '[]')
      
      // Trouver l'index de la tâche à modifier
      const taskIndex = existingTasks.findIndex((task: MaintenanceTask) => task.id === formData.id)
      
      // Mettre à jour ou ajouter la tâche
      if (taskIndex !== -1) {
        existingTasks[taskIndex] = formData
      } else {
        existingTasks.push(formData)
      }
      
      // Sauvegarder dans le localStorage
      localStorage.setItem('maintenanceTasks', JSON.stringify(existingTasks))
      
      // Simuler un délai de sauvegarde pour le retour visuel
      await new Promise(resolve => setTimeout(resolve, 500))
      
      toast.success("Les modifications ont été enregistrées avec succès")
      router.push("/dashboard/maintenance")
      
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
      toast.error("Une erreur est survenue lors de la sauvegarde")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold">Tâche non trouvée</h2>
            <p className="text-gray-600 mt-2">La tâche demandée n'existe pas.</p>
            <Button className="mt-4" onClick={() => router.push("/dashboard/maintenance")}>
              Retour à la liste
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Modifier la tâche de maintenance</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">ID Hydrant</label>
                  <Input
                    value={formData.hydrantId}
                    onChange={(e) => handleChange("hydrantId", e.target.value)}
                    placeholder="ID de l'hydrant"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Titre</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="Titre de la tâche"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Description détaillée"
                    className="mt-1"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Priorité</label>
                  <Select 
                    value={formData.priority}
                    onValueChange={(value) => handleChange("priority", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Sélectionner la priorité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">Urgente</SelectItem>
                      <SelectItem value="high">Élevée</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="low">Faible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Statut</label>
                  <Select 
                    value={formData.status}
                    onValueChange={(value) => handleChange("status", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Sélectionner le statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="in-progress">En cours</SelectItem>
                      <SelectItem value="completed">Terminée</SelectItem>
                      <SelectItem value="cancelled">Annulée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Assigné à</label>
                  <Input
                    value={formData.assignedTo}
                    onChange={(e) => handleChange("assignedTo", e.target.value)}
                    placeholder="Nom de l'agent"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Localisation</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    placeholder="Adresse de l'hydrant"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Date prévue</label>
                  <div className="relative mt-1">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) => handleChange("scheduledDate", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Durée estimée</label>
                  <Input
                    value={formData.estimatedDuration}
                    onChange={(e) => handleChange("estimatedDuration", e.target.value)}
                    placeholder="Ex: 2h"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Type d'intervention</label>
                  <Select 
                    value={formData.type}
                    onValueChange={(value) => handleChange("type", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inspection">Inspection</SelectItem>
                      <SelectItem value="repair">Réparation</SelectItem>
                      <SelectItem value="replacement">Remplacement</SelectItem>
                      <SelectItem value="emergency">Urgence</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/maintenance")}
              >
                Annuler
              </Button>
              <Button type="submit">
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 