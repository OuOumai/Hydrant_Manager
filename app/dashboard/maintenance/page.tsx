"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Wrench,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Plus,
  Zap,
  Target,
  TrendingUp,
  BarChart3,
} from "lucide-react"
import { useRouter } from "next/navigation"

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

interface Task {
  id: string
  hydrantId: string
  type: string
  priority: string
  status: string
  assignedTo: string
  scheduledDate: string
  estimatedDuration: string
  progress?: number
  description?: string
  address: string
}

// Déplacer les tâches par défaut dans une constante
const DEFAULT_TASKS: MaintenanceTask[] = [
  {
    id: "1",
    hydrantId: "H-TNG-042",
    title: "Remplacement valve principale",
    description: "Valve défectueuse détectée lors de l'inspection. Remplacement urgent nécessaire.",
    priority: "urgent",
    status: "in-progress",
    assignedTo: "Mohammed Salim",
    location: "Avenue Mohammed VI, Tanger",
    scheduledDate: "2023-06-15",
    estimatedDuration: "4h",
    progress: 65,
    type: "replacement"
  },
  {
    id: "2",
    hydrantId: "H-TET-003",
    title: "Inspection annuelle",
    description: "Contrôle de routine annuel selon les normes de sécurité.",
    priority: "medium",
    status: "completed",
    assignedTo: "Omar Alami",
    location: "Boulevard Moulay Rachid, Tétouan",
    scheduledDate: "2023-06-10",
    estimatedDuration: "2h",
    progress: 100,
    type: "inspection"
  },
  {
    id: "3",
    hydrantId: "H-TNG-005",
    title: "Réparation fuite",
    description: "Fuite détectée au niveau du raccordement principal.",
    priority: "high",
    status: "pending",
    assignedTo: "Rachid Moussaoui",
    location: "Rue Al Andalous, Tanger",
    scheduledDate: "2023-06-16",
    estimatedDuration: "3h",
    progress: 0,
    type: "repair"
  },
  {
    id: "4",
    hydrantId: "H-AHC-003",
    title: "Remplacement complet",
    description: "Hydrant en fin de vie, remplacement complet nécessaire.",
    priority: "high",
    status: "pending",
    assignedTo: "Karim Idrissi",
    location: "Place Al Massira, Al Hoceima",
    scheduledDate: "2023-06-20",
    estimatedDuration: "6h",
    progress: 0,
    type: "replacement"
  },
  {
    id: "5",
    hydrantId: "H-TNG-006",
    title: "Maintenance préventive",
    description: "Nettoyage et lubrification des mécanismes.",
    priority: "low",
    status: "completed",
    assignedTo: "Leila Fassi",
    location: "Quartier Administratif, Tanger",
    scheduledDate: "2023-06-08",
    estimatedDuration: "1h30",
    progress: 100,
    type: "inspection"
  },
  {
    id: "6",
    hydrantId: "H-TET-004",
    title: "Urgence - Accident véhicule",
    description: "Hydrant endommagé suite à un accident de la circulation.",
    priority: "urgent",
    status: "in-progress",
    assignedTo: "Sofia El Amrani",
    location: "Avenue Hassan II, Tétouan",
    scheduledDate: "2023-06-14",
    estimatedDuration: "5h",
    progress: 30,
    type: "emergency"
  },
]

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "bg-red-500 text-white"
    case "high":
      return "bg-orange-500 text-white"
    case "medium":
      return "bg-yellow-500 text-white"
    case "low":
      return "bg-green-500 text-white"
    default:
      return "bg-gray-500 text-white"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 border-green-200"
    case "in-progress":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "inspection":
      return <Target className="h-4 w-4" />
    case "repair":
      return <Wrench className="h-4 w-4" />
    case "replacement":
      return <Zap className="h-4 w-4" />
    case "emergency":
      return <AlertTriangle className="h-4 w-4" />
    default:
      return <Wrench className="h-4 w-4" />
  }
}

export default function MaintenancePage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<MaintenanceTask[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [user, setUser] = useState<{ username: string; role: string; name: string } | null>(null)
  const [planningTasks, setPlanningTasks] = useState<Task[]>([])

  useEffect(() => {
    // Récupérer les informations de l'utilisateur
    const userStr = localStorage.getItem("user")
    if (!userStr) {
      router.push("/")
      return
    }

    try {
      const userData = JSON.parse(userStr)
      setUser(userData)
    } catch (error) {
      router.push("/")
    }
  }, [router])

  useEffect(() => {
    // Initialiser ou charger les tâches
    const initializeTasks = () => {
      const savedTasks = localStorage.getItem('maintenanceTasks')
      if (!savedTasks) {
        // Si aucune tâche n'existe, utiliser les tâches par défaut
        localStorage.setItem('maintenanceTasks', JSON.stringify(DEFAULT_TASKS))
        setTasks(DEFAULT_TASKS)
      } else {
        try {
          const parsedTasks = JSON.parse(savedTasks)
          // Vérifier si le tableau est vide, si oui, utiliser les tâches par défaut
          if (!Array.isArray(parsedTasks) || parsedTasks.length === 0) {
            localStorage.setItem('maintenanceTasks', JSON.stringify(DEFAULT_TASKS))
            setTasks(DEFAULT_TASKS)
          } else {
            setTasks(parsedTasks)
          }
        } catch (error) {
          console.error("Erreur lors du chargement des tâches:", error)
          // En cas d'erreur, utiliser les tâches par défaut
          localStorage.setItem('maintenanceTasks', JSON.stringify(DEFAULT_TASKS))
          setTasks(DEFAULT_TASKS)
        }
      }
    }

    initializeTasks()
  }, [])

  useEffect(() => {
    // Charger les tâches de planification
    if (typeof window !== 'undefined') {
      const savedPlanningTasks = localStorage.getItem('planningTasks')
      if (savedPlanningTasks) {
        const tasks = JSON.parse(savedPlanningTasks)
        setPlanningTasks(tasks)
      }
    }
  }, [])

  // Filtrer d'abord les tâches selon le rôle de l'utilisateur
  const userTasks = tasks.filter((task) => {
    if (user?.role === "technician") {
      return task.assignedTo === user.name
    }
    return true
  })

  // Ensuite appliquer les filtres de recherche
  const filteredTasks = userTasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.hydrantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  // Filtrer les tâches de planification pour le technicien connecté
  const assignedPlanningTasks = planningTasks.filter((task) => {
    if (user?.role === "technician") {
      return task.assignedTo === user.name
    }
    return false
  })

  // Calculer les statistiques des tâches planifiées pour le technicien
  const planningStats = {
    total: assignedPlanningTasks.length,
    pending: assignedPlanningTasks.filter(t => t.status === "pending").length,
    inProgress: assignedPlanningTasks.filter(t => t.status === "inProgress").length,
    completed: assignedPlanningTasks.filter(t => t.status === "completed").length,
    hydrants: new Set(assignedPlanningTasks.map(t => t.hydrantId)).size,
    averageProgress: assignedPlanningTasks.reduce((acc, curr) => acc + (curr.progress || 0), 0) / assignedPlanningTasks.length || 0
  }

  // Fonction pour marquer une tâche comme terminée
  const handleCompleteTask = (taskId: string) => {
    const updatedTasks = planningTasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          status: "completed",
          progress: 100
        }
      }
      return task
    })
    setPlanningTasks(updatedTasks)
    if (typeof window !== 'undefined') {
      localStorage.setItem('planningTasks', JSON.stringify(updatedTasks))
    }
  }

  // Calculer les statistiques de la même manière pour tous les rôles
  const stats = {
    total: userTasks.length,
    completed: userTasks.filter(t => t.status === "completed").length,
    inProgress: userTasks.filter(t => t.status === "in-progress").length,
    pending: userTasks.filter(t => t.status === "pending").length,
    urgent: userTasks.filter(t => t.priority === "urgent").length,
    averageCompletion: userTasks.reduce((acc, curr) => acc + curr.progress, 0) / userTasks.length || 0,
    hydrantsServiced: new Set(userTasks.map(t => t.hydrantId)).size,
  }

  const handleEditTask = (task: MaintenanceTask) => {
    setSelectedTask(task)
    setIsEditMode(true)
    // Rediriger vers la page d'édition avec l'ID de la tâche
    router.push(`/dashboard/maintenance/edit/${task.id}`)
  }

  const handleViewHydrant = (hydrantId: string) => {
    // Rediriger vers la page de détails de l'hydrant
    router.push(`/dashboard/hydrant/${hydrantId}`)
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Header avec titre */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🔧 Centre de Maintenance
          </h1>
          <p className="text-muted-foreground">
            {user.role === "technician" 
              ? "Gestion de vos interventions" 
              : "Gestion intelligente des interventions"}
          </p>
        </div>
      </div>

      {/* Vue Technicien */}
      {user?.role === "technician" ? (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <User className="h-5 w-5" />
              Profil Technicien
            </CardTitle>
            <CardDescription>Vos tâches assignées et interventions planifiées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Profil du technicien */}
              <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">Technicien de maintenance</p>
                </div>
              </div>

              {/* Statistiques du technicien */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Mes interventions</p>
                        <p className="text-2xl font-bold text-blue-700">{planningStats.total}</p>
                      </div>
                      <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <Wrench className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-yellow-600">En attente</p>
                        <p className="text-2xl font-bold text-yellow-700">{planningStats.pending}</p>
                      </div>
                      <div className="h-12 w-12 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-orange-600">En cours</p>
                        <p className="text-2xl font-bold text-orange-700">{planningStats.inProgress}</p>
                      </div>
                      <div className="h-12 w-12 bg-orange-500 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">Terminées</p>
                        <p className="text-2xl font-bold text-green-700">{planningStats.completed}</p>
                      </div>
                      <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Hydrants</p>
                        <p className="text-2xl font-bold text-purple-700">{planningStats.hydrants}</p>
                      </div>
                      <div className="h-12 w-12 bg-purple-500 rounded-full flex items-center justify-center">
                        <Target className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-indigo-600">Progression</p>
                        <p className="text-2xl font-bold text-indigo-700">{Math.round(planningStats.averageProgress)}%</p>
                      </div>
                      <div className="h-12 w-12 bg-indigo-500 rounded-full flex items-center justify-center">
                        <BarChart3 className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Liste des tâches planifiées */}
              <div>
                <h3 className="font-semibold mb-3">Tâches planifiées ({assignedPlanningTasks.length})</h3>
                <div className="space-y-3">
                  {assignedPlanningTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 rounded-lg border bg-white hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(task.type)}
                          <span className="font-medium">{task.hydrantId}</span>
                        </div>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority === "high" ? "Élevée" : task.priority === "medium" ? "Moyenne" : "Faible"}
                        </Badge>
                      </div>
                      
                      <p className="text-sm font-medium mb-2">{task.type}</p>
                      
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{task.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(task.scheduledDate).toLocaleDateString("fr-FR")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{task.estimatedDuration}</span>
                        </div>
                      </div>

                      {task.status === "inProgress" && task.progress !== undefined && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progression</span>
                            <span>{task.progress}%</span>
                          </div>
                          <Progress value={task.progress} className="h-2" />
                        </div>
                      )}

                      <div className="mt-4 flex justify-end">
                        {task.status !== "completed" && (
                          <Button
                            onClick={() => handleCompleteTask(task.id)}
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Marquer comme terminée
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                  {assignedPlanningTasks.length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p className="font-medium">Aucune tâche planifiée</p>
                      <p className="text-sm">Vous n'avez pas de tâches assignées pour le moment</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Vue Gestionnaire
        <>
          {/* Statistiques communes pour le gestionnaire */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">
                      {user.role === "technician" ? "Mes interventions" : "Total interventions"}
                    </p>
                    <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <Wrench className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600">En attente</p>
                    <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
                  </div>
                  <div className="h-12 w-12 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">En cours</p>
                    <p className="text-2xl font-bold text-blue-700">{stats.inProgress}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Terminées</p>
                    <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
                  </div>
                  <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Hydrants</p>
                    <p className="text-2xl font-bold text-purple-700">{stats.hydrantsServiced}</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-600">Progression</p>
                    <p className="text-2xl font-bold text-indigo-700">{Math.round(stats.averageCompletion)}%</p>
                  </div>
                  <div className="h-12 w-12 bg-indigo-500 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtres avancés */}
          <Card className="bg-gradient-to-r from-gray-50 to-gray-100">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="🔍 Rechercher par hydrant, lieu ou description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px] bg-white">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="in-progress">En cours</SelectItem>
                    <SelectItem value="completed">Terminées</SelectItem>
                    <SelectItem value="cancelled">Annulées</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-full md:w-[180px] bg-white">
                    <SelectValue placeholder="Priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes priorités</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                    <SelectItem value="high">Élevée</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="low">Faible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Liste des tâches avec design moderne */}
          <div className="grid gap-4">
            {filteredTasks.map((task) => (
              <Card
                key={task.id}
                className={`transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer border-l-4 ${
                  task.priority === "urgent"
                    ? "border-l-red-500 bg-red-50/50"
                    : task.priority === "high"
                      ? "border-l-orange-500 bg-orange-50/50"
                      : task.priority === "medium"
                        ? "border-l-yellow-500 bg-yellow-50/50"
                        : "border-l-green-500 bg-green-50/50"
                }`}
                onClick={() => setSelectedTask(task)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`p-2 rounded-full ${
                            task.type === "emergency"
                              ? "bg-red-100"
                              : task.type === "replacement"
                                ? "bg-purple-100"
                                : task.type === "repair"
                                  ? "bg-blue-100"
                                  : "bg-green-100"
                          }`}
                        >
                          {getTypeIcon(task.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">{task.hydrantId}</p>
                        </div>
                        <Badge className={`${getPriorityColor(task.priority)} animate-pulse`}>
                          {task.priority === "urgent"
                            ? "🚨 URGENT"
                            : task.priority === "high"
                              ? "⚠️ ÉLEVÉE"
                              : task.priority === "medium"
                                ? "📋 MOYENNE"
                                : "✅ FAIBLE"}
                        </Badge>
                      </div>

                      <p className="text-gray-600 mb-3">{task.description}</p>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {task.assignedTo}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {task.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(task.scheduledDate).toLocaleDateString("fr-FR")}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {task.estimatedDuration}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <Badge className={`${getStatusColor(task.status)} border`}>
                        {task.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                        {task.status === "in-progress" && <Clock className="h-3 w-3 mr-1" />}
                        {task.status === "pending" && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {task.status === "cancelled" && <XCircle className="h-3 w-3 mr-1" />}
                        {task.status === "completed"
                          ? "Terminée"
                          : task.status === "in-progress"
                            ? "En cours"
                            : task.status === "pending"
                              ? "En attente"
                              : "Annulée"}
                      </Badge>

                      {task.status === "in-progress" && (
                        <div className="w-32">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progression</span>
                            <span>{task.progress}%</span>
                          </div>
                          <Progress value={task.progress} className="h-2" />
                        </div>
                      )}

                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="hover:bg-blue-50"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedTask(task)
                        }}
                      >
                        👁️ Détails
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Message si aucune tâche trouvée */}
          {filteredTasks.length === 0 && (
            <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">Aucune tâche trouvée</h3>
                <p className="text-muted-foreground">
                  Essayez de modifier vos filtres de recherche
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Modal de détails (si une tâche est sélectionnée) - uniquement pour le gestionnaire */}
      {selectedTask && user.role === "manager" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{selectedTask.title}</CardTitle>
                  <CardDescription className="text-blue-100">
                    {selectedTask.hydrantId} • {selectedTask.location}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTask(null)}
                  className="text-white hover:bg-white/20"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-gray-600">{selectedTask.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Assigné à</h4>
                    <p className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {selectedTask.assignedTo}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Date prévue</h4>
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(selectedTask.scheduledDate).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>

                {selectedTask.status === "in-progress" && (
                  <div>
                    <h4 className="font-semibold mb-2">Progression</h4>
                    <Progress value={selectedTask.progress} className="h-3" />
                    <p className="text-sm text-muted-foreground mt-1">{selectedTask.progress}% terminé</p>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button 
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() => handleEditTask(selectedTask)}
                  >
                    Modifier la tâche
                  </Button>
                  <Button 
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() => handleViewHydrant(selectedTask.hydrantId)}
                  >
                    Voir l'hydrant
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
