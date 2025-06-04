"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CalendarIcon,
  Clock,
  MapPin,
  User,
  Wrench,
  CheckCircle,
  Search,
  Plus,
  Eye,
  Edit,
  Target,
  Zap,
  Users,
  TrendingUp,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { useRouter } from "next/navigation"

interface Task {
  id: string
  hydrantId: string
  address: string
  type: string
  priority: string
  status: string
  assignedTo: string
  scheduledDate: string
  estimatedDuration: string
  progress?: number
  description?: string
}

const mockTasks: Task[] = [
  {
    id: "TK001",
    hydrantId: "H-TNG-001",
    address: "Avenue Mohammed VI, 90000 Tanger",
    type: "Inspection",
    priority: "medium",
    status: "completed",
    assignedTo: "Mohammed Salim",
    scheduledDate: "2025-07-06",
    estimatedDuration: "1h30",
    progress: 75,
    description: "Inspection semestrielle en cours - Vérification des paramètres",
  },
  {
    id: "TK002",
    hydrantId: "H-TNG-002",
    address: "Boulevard Moulay Rachid, 90000 Tanger",
    type: "Réparation",
    priority: "high",
    status: "inProgress",
    assignedTo: "Rachid Moussaoui",
    scheduledDate: "2025-06-13",
    estimatedDuration: "3h00",
    progress: 45,
    description: "Réparation de la valve principale suite à une baisse de pression",
  },
  {
    id: "TK003",
    hydrantId: "H-TET-001",
    address: "Avenue Hassan II, 93000 Tétouan",
    type: "Remplacement",
    priority: "high",
    status: "assigned",
    assignedTo: "Omar Alami",
    scheduledDate: "2025-06-10",
    estimatedDuration: "4h00",
    progress: 30,
    description: "Remplacement complet de l'hydrant - Travaux en cours",
  },
  {
    id: "TK004",
    hydrantId: "H-AHC-001",
    address: "Rue Mohammed V, 32000 Al Hoceima",
    type: "Maintenance",
    priority: "medium",
    status: "assigned",
    assignedTo: "Leila Fassi",
    scheduledDate: "2025-09-10",
    estimatedDuration: "2h00",
    progress: 0,
    description: "Maintenance préventive programmée",
  },
  {
    id: "TK005",
    hydrantId: "H-TET-002",
    address: "Avenue des FAR, 93000 Tétouan",
    type: "Nettoyage",
    priority: "medium",
    status: "pending",
    assignedTo: "",
    scheduledDate: "2025-10-12",
    estimatedDuration: "2h00",
    progress: 0,
    description: "Nettoyage complet à programmer",
  },
  // Prochaines inspections planifiées
  {
    id: "TK006",
    hydrantId: "H-TNG-001",
    address: "Avenue Mohammed VI, 90000 Tanger",
    type: "Inspection",
    priority: "medium",
    status: "pending",
    assignedTo: "",
    scheduledDate: "2025-09-06",
    estimatedDuration: "1h30",
    progress: 0,
    description: "Prochaine inspection semestrielle planifiée",
  },
  {
    id: "TK007",
    hydrantId: "H-TNG-002",
    address: "Boulevard Moulay Rachid, 90000 Tanger",
    type: "Inspection",
    priority: "medium",
    status: "pending",
    assignedTo: "",
    scheduledDate: "2025-10-15",
    estimatedDuration: "1h30",
    progress: 0,
    description: "Prochaine inspection semestrielle planifiée",
  }
]

const PlanningPage = () => {
  // Forcer la réinitialisation des données
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('planningTasks')
      localStorage.setItem('planningTasks', JSON.stringify(mockTasks))
    }
  }, [])

  // Initialiser les tâches avec les mockTasks
  const [tasks, setTasks] = useState<Task[]>(mockTasks)

  // Sauvegarder dans localStorage quand les tâches changent
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('planningTasks', JSON.stringify(tasks))
    }
  }, [tasks])

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState<Task | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [newTask, setNewTask] = useState<Partial<Task>>({
    status: "pending",
    priority: "medium",
    scheduledDate: new Date().toISOString().split('T')[0],
    estimatedDuration: "1h00",
  })
  const [viewMode, setViewMode] = useState<"calendar" | "kanban" | "timeline">("kanban")
  const { toast } = useToast()
  const router = useRouter()

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500 text-white"
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
      case "assigned":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "inProgress":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Inspection":
        return <Target className="h-4 w-4" />
      case "Réparation":
        return <Wrench className="h-4 w-4" />
      case "Remplacement":
        return <Zap className="h-4 w-4" />
      case "Nettoyage":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Wrench className="h-4 w-4" />
    }
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.hydrantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    assigned: tasks.filter((t) => t.status === "assigned").length,
    inProgress: tasks.filter((t) => t.status === "inProgress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  }

  // Calendar navigation functions
  const navigateDate = (direction: "prev" | "next") => {
    if (!selectedDate) return

    const newDate = new Date(selectedDate)
    if (direction === "prev") {
      newDate.setDate(newDate.getDate() - 1)
    } else {
      newDate.setDate(newDate.getDate() + 1)
    }
    setSelectedDate(newDate)
  }

  const KanbanView = () => {
    const columns = [
      { id: "pending", title: "📋 En attente", status: "pending", color: "border-gray-300" },
      { id: "assigned", title: "👥 Assignées", status: "assigned", color: "border-blue-300" },
      { id: "inProgress", title: "🔄 En cours", status: "inProgress", color: "border-orange-300" },
      { id: "completed", title: "✅ Terminées", status: "completed", color: "border-green-300" },
    ]

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <div key={column.id} className={`border-2 ${column.color} rounded-lg bg-gray-50/50`}>
            <div className="p-4 border-b bg-white rounded-t-lg">
              <h3 className="font-semibold text-lg">{column.title}</h3>
              <p className="text-sm text-muted-foreground">
                {filteredTasks.filter((task) => task.status === column.status).length} tâches
              </p>
            </div>
            <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
              {filteredTasks
                .filter((task) => task.status === column.status)
                .map((task) => (
                  <Card
                    key={task.id}
                    className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105"
                    onClick={() => setSelectedTask(task)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(task.type)}
                          <span className="font-medium text-sm">{task.hydrantId}</span>
                        </div>
                        <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
                          {task.priority === "high" ? "Élevée" : task.priority === "medium" ? "Moyenne" : "Faible"}
                        </Badge>
                      </div>

                      <h4 className="font-semibold mb-2">{task.type}</h4>

                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{task.address}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          <span>{new Date(task.scheduledDate).toLocaleDateString("fr-FR")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{task.estimatedDuration}</span>
                        </div>
                      </div>

                      {task.status === "inProgress" && task.progress !== undefined && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progression</span>
                            <span>{task.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      <div className="mt-3 flex items-center justify-between">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                        <span className="text-xs font-medium">{task.assignedTo}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const TimelineView = () => (
    <div className="space-y-4">
      {filteredTasks
        .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
        .map((task, index) => (
          <div key={task.id} className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-4 h-4 rounded-full ${getPriorityColor(task.priority)}`}></div>
              {index < filteredTasks.length - 1 && <div className="w-0.5 h-16 bg-gray-300 mt-2"></div>}
            </div>
            <Card
              className="flex-1 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedTask(task)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(task.type)}
                    <span className="font-semibold">
                      {task.hydrantId} - {task.type}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={`${getPriorityColor(task.priority)}`}>
                      {task.priority === "high" ? "Élevée" : task.priority === "medium" ? "Moyenne" : "Faible"}
                    </Badge>
                    <Badge className={`${getStatusColor(task.status)} border`}>{task.status}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{task.address}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(task.scheduledDate).toLocaleDateString("fr-FR")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{task.assignedTo}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
    </div>
  )

  const handleEditTask = (task: Task) => {
    setEditedTask({ ...task })
    setIsEditing(true)
  }

  const handleSaveTask = () => {
    if (!editedTask) return

    const updatedTasks = tasks.map(task => task.id === editedTask.id ? editedTask : task)
    setTasks(updatedTasks)
    setSelectedTask(editedTask)
    setIsEditing(false)
    
    toast({
      title: "Tâche modifiée",
      description: "Les modifications ont été enregistrées avec succès.",
    })
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditedTask(null)
  }

  const handleViewHydrant = (hydrantId: string) => {
    router.push(`/dashboard/hydrant/${hydrantId}`)
  }

  const handleCreateTask = () => {
    setIsCreating(true)
  }

  const handleSaveNewTask = () => {
    if (!newTask.hydrantId || !newTask.type || !newTask.description || !newTask.assignedTo) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      })
      return
    }

    const taskId = `TK${String(tasks.length + 1).padStart(3, '0')}`
    const createdTask: Task = {
      id: taskId,
      hydrantId: newTask.hydrantId!,
      address: newTask.address || "",
      type: newTask.type!,
      priority: newTask.priority || "medium",
      status: newTask.status || "pending",
      assignedTo: newTask.assignedTo!,
      scheduledDate: newTask.scheduledDate || new Date().toISOString().split('T')[0],
      estimatedDuration: newTask.estimatedDuration || "1h00",
      description: newTask.description!,
      progress: newTask.status === "inProgress" ? 0 : undefined,
    }

    setTasks([...tasks, createdTask])
    setIsCreating(false)
    setNewTask({
      status: "pending",
      priority: "medium",
      scheduledDate: new Date().toISOString().split('T')[0],
      estimatedDuration: "1h00",
    })

    toast({
      title: "Tâche créée",
      description: "La nouvelle tâche a été créée avec succès.",
    })
  }

  const handleCancelCreate = () => {
    setIsCreating(false)
    setNewTask({
      status: "pending",
      priority: "medium",
      scheduledDate: new Date().toISOString().split('T')[0],
      estimatedDuration: "1h00",
    })
  }

  const handleResetData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('planningTasks')
      setTasks(mockTasks)
      toast({
        title: "Données réinitialisées",
        description: "Les données ont été restaurées à leur état initial.",
      })
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            📅 Centre de Planification
          </h1>
          <p className="text-muted-foreground">Orchestrez vos interventions avec intelligence</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button 
            variant="outline"
            onClick={handleResetData}
          >
            🔄 Réinitialiser
          </Button>
          <Button 
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            onClick={handleCreateTask}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle tâche
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total</p>
                <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-gray-700">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Assignées</p>
                <p className="text-2xl font-bold text-blue-700">{stats.assigned}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">En cours</p>
                <p className="text-2xl font-bold text-orange-700">{stats.inProgress}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
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
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and View Toggle */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="🔍 Rechercher par hydrant, lieu ou type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="assigned">Assignées</SelectItem>
                <SelectItem value="inProgress">En cours</SelectItem>
                <SelectItem value="completed">Terminées</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes priorités</SelectItem>
                <SelectItem value="high">Élevée</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="low">Faible</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant={viewMode === "kanban" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("kanban")}
              >
                📋 Kanban
              </Button>
              <Button
                variant={viewMode === "timeline" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("timeline")}
              >
                📈 Timeline
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">{viewMode === "kanban" ? <KanbanView /> : <TimelineView />}</div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Enhanced Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                📅 Calendrier
                <Badge variant="outline" className="text-xs">
                  {
                    filteredTasks.filter(
                      (task) => new Date(task.scheduledDate).toDateString() === selectedDate?.toDateString(),
                    ).length
                  }{" "}
                  tâches
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                selected={selectedDate}
                onSelect={setSelectedDate}
                tasks={filteredTasks}
                onTaskClick={setSelectedTask}
                className="rounded-md border"
              />

              {/* Tasks for selected date */}
              <div className="mt-4 space-y-2">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Tâches du jour sélectionné
                </h4>

                <div className="space-y-2">
                  {filteredTasks
                    .filter((task) => new Date(task.scheduledDate).toDateString() === selectedDate?.toDateString())
                    .map((task) => (
                      <div
                        key={task.id}
                        className="p-3 rounded-lg border bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 cursor-pointer transition-all duration-200 hover:shadow-sm"
                        onClick={() => setSelectedTask(task)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(task.type)}
                            <span className="text-sm font-medium">{task.hydrantId}</span>
                          </div>
                          <Badge className={`${getPriorityColor(task.priority)} text-xs px-2 py-1`}>
                            {task.priority === "high" ? "Élevée" : task.priority === "medium" ? "Moyenne" : "Faible"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 font-medium mb-1">{task.type}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.estimatedDuration}
                          </span>
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                            <span className="text-xs text-gray-600">{task.assignedTo}</span>
                          </div>
                        </div>
                      </div>
                    ))}

                  {filteredTasks.filter(
                    (task) => new Date(task.scheduledDate).toDateString() === selectedDate?.toDateString(),
                  ).length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm font-medium">Aucune tâche prévue</p>
                      <p className="text-xs">Cette journée est libre</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Task Detail/Edit Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">
                    {selectedTask.hydrantId} - {selectedTask.type}
                  </CardTitle>
                  <CardDescription className="text-blue-100">{selectedTask.address}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedTask(null)
                    setIsEditing(false)
                    setEditedTask(null)
                  }}
                  className="text-white hover:bg-white/20"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {isEditing && editedTask ? (
                // Formulaire d'édition
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <textarea
                      className="w-full p-2 border rounded-md"
                      value={editedTask.description}
                      onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Date prévue</h4>
                      <Input
                        type="date"
                        value={editedTask.scheduledDate}
                        onChange={(e) => setEditedTask({ ...editedTask, scheduledDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Durée estimée</h4>
                      <Input
                        type="text"
                        value={editedTask.estimatedDuration}
                        onChange={(e) => setEditedTask({ ...editedTask, estimatedDuration: e.target.value })}
                        placeholder="ex: 2h30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Priorité</h4>
                      <Select
                        value={editedTask.priority}
                        onValueChange={(value) => setEditedTask({ ...editedTask, priority: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">Élevée</SelectItem>
                          <SelectItem value="medium">Moyenne</SelectItem>
                          <SelectItem value="low">Faible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Statut</h4>
                      <Select
                        value={editedTask.status}
                        onValueChange={(value) => setEditedTask({ ...editedTask, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">En attente</SelectItem>
                          <SelectItem value="assigned">Assignée</SelectItem>
                          <SelectItem value="inProgress">En cours</SelectItem>
                          <SelectItem value="completed">Terminée</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {editedTask.status === "inProgress" && (
                    <div>
                      <h4 className="font-semibold mb-2">Progression (%)</h4>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={editedTask.progress}
                        onChange={(e) => setEditedTask({ ...editedTask, progress: Number(e.target.value) })}
                      />
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600"
                      onClick={handleSaveTask}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Enregistrer
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={handleCancelEdit}
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              ) : (
                // Vue détaillée
                <>
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-gray-600">{selectedTask.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Date prévue</h4>
                      <p className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        {new Date(selectedTask.scheduledDate).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Durée estimée</h4>
                      <p className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {selectedTask.estimatedDuration}
                      </p>
                    </div>
                  </div>

                  {selectedTask.status === "inProgress" && selectedTask.progress !== undefined && (
                    <div>
                      <h4 className="font-semibold mb-2">Progression</h4>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${selectedTask.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{selectedTask.progress}% terminé</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600"
                      onClick={() => handleEditTask(selectedTask)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleViewHydrant(selectedTask.hydrantId)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Voir l'hydrant
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* New Task Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">Nouvelle tâche</CardTitle>
                  <CardDescription className="text-blue-100">Créer une nouvelle intervention</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelCreate}
                  className="text-white hover:bg-white/20"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">ID Hydrant*</h4>
                  <Input
                    placeholder="ex: H-TNG-001"
                    value={newTask.hydrantId || ""}
                    onChange={(e) => setNewTask({ ...newTask, hydrantId: e.target.value })}
                  />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Type d'intervention*</h4>
                  <Select
                    value={newTask.type || ""}
                    onValueChange={(value) => setNewTask({ ...newTask, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inspection">Inspection</SelectItem>
                      <SelectItem value="Réparation">Réparation</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Remplacement">Remplacement</SelectItem>
                      <SelectItem value="Nettoyage">Nettoyage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Adresse</h4>
                <Input
                  placeholder="Adresse de l'hydrant"
                  value={newTask.address || ""}
                  onChange={(e) => setNewTask({ ...newTask, address: e.target.value })}
                />
              </div>

              <div>
                <h4 className="font-semibold mb-2">Description*</h4>
                <textarea
                  className="w-full p-2 border rounded-md"
                  placeholder="Description détaillée de l'intervention..."
                  value={newTask.description || ""}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Date prévue</h4>
                  <Input
                    type="date"
                    value={newTask.scheduledDate}
                    onChange={(e) => setNewTask({ ...newTask, scheduledDate: e.target.value })}
                  />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Durée estimée</h4>
                  <Input
                    type="text"
                    value={newTask.estimatedDuration}
                    onChange={(e) => setNewTask({ ...newTask, estimatedDuration: e.target.value })}
                    placeholder="ex: 2h30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Priorité</h4>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Élevée</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="low">Faible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Statut</h4>
                  <Select
                    value={newTask.status}
                    onValueChange={(value) => setNewTask({ ...newTask, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="assigned">Assignée</SelectItem>
                      <SelectItem value="inProgress">En cours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Assigné à*</h4>
                <Input
                  placeholder="Nom de l'intervenant"
                  value={newTask.assignedTo || ""}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600"
                  onClick={handleSaveNewTask}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Créer la tâche
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleCancelCreate}
                >
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default PlanningPage
