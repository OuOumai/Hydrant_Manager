"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Send,
  MapPin,
  AlertTriangle,
  User,
  MessageSquare,
  Plus,
  Phone,
  Video,
  Paperclip,
  Camera,
  Mic,
  Search,
  MoreVertical,
  CheckCheck,
  Check,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Sender {
  name: string
  role: string
  avatar?: string
  isOnline?: boolean
}

interface Location {
  lat: number
  lng: number
  address: string
}

interface Message {
  id: string
  sender: Sender
  content: string
  timestamp: string
  location?: Location
  isEmergency?: boolean
  attachment?: {
    type: "image" | "document"
    name: string
    url: string
  }
  status?: "sent" | "delivered" | "read"
}

interface Conversation {
  id: string
  title: string
  participants: Array<{
    name: string
    role: string
    isOnline: boolean
  }>
  lastMessage: string
  timestamp: string
  unread: number
  isEmergency?: boolean
  type: "group" | "direct"
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showNewConversation, setShowNewConversation] = useState(false)
  const [newConversationTitle, setNewConversationTitle] = useState("")
  const [newConversationType, setNewConversationType] = useState<"group" | "direct">("group")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Simulate fetching conversations
    const fetchConversations = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockConversations: Conversation[] = [
        {
          id: "conv1",
          title: "Hydrant H-TNG-042 - Avenue Mohammed VI",
          participants: [
            { name: "Mohammed Salim", role: "Technicien", isOnline: true },
            { name: "Ali Alawi", role: "Gestionnaire", isOnline: true },
            { name: "Ahmed Benali", role: "Pompier", isOnline: false },
          ],
          lastMessage: "Pression mesurée : 6 bars - Conforme aux normes",
          timestamp: "10:23",
          unread: 0,
          type: "group",
        },
        {
          id: "conv2",
          title: "Hydrant H-TET-018 - Boulevard Moulay Rachid",
          participants: [
            { name: "Omar Alami", role: "Technicien", isOnline: true },
            { name: "Laila Bennani", role: "Gestionnaire", isOnline: false },
            { name: "Youssef Tazi", role: "Pompier", isOnline: true },
          ],
          lastMessage: "Vanne principale à remplacer - Programmation maintenance",
          timestamp: "Hier",
          unread: 2,
          type: "group",
        },
        {
          id: "conv3",
          title: "Hydrant H-AHC-067 - Rue Al Massira",
          participants: [
            { name: "Rachid Moussaoui", role: "Technicien", isOnline: true },
            { name: "Aicha Kadiri", role: "Gestionnaire", isOnline: true },
            { name: "Hassan Berrada", role: "Pompier", isOnline: true },
            { name: "Karim Idrissi", role: "Technicien", isOnline: true },
          ],
          lastMessage: "URGENT : Fuite majeure détectée - Intervention immédiate requise",
          timestamp: "23/05",
          unread: 5,
          isEmergency: true,
          type: "group",
        },
        {
          id: "conv4",
          title: "Hydrant H-TNG-156 - Quartier Administratif",
          participants: [
            { name: "Leila Fassi", role: "Technicien", isOnline: true },
            { name: "Sofia El Amrani", role: "Technicien", isOnline: true },
            { name: "Kamal Tazi", role: "Pompier", isOnline: false },
          ],
          lastMessage: "Inspection annuelle planifiée pour demain",
          timestamp: "15:30",
          unread: 1,
          type: "group",
        },
      ]

      setConversations(mockConversations)
      setSelectedConversation(mockConversations[0].id)
      setIsLoading(false)
    }

    fetchConversations()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      // Simulate fetching messages for the selected conversation
      const fetchMessages = async () => {
        setIsLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 500))

        const mockMessages: Record<string, Message[]> = {
          "conv1": [
            {
              id: "msg1",
              sender: {
                name: "Mohammed Salim",
                role: "Technicien",
                isOnline: true,
              },
              content: "Début de l'inspection de l'hydrant H-TNG-042",
              timestamp: "09:15",
              location: {
                lat: 35.7595,
                lng: -5.834,
                address: "Avenue Mohammed VI, 90000 Tanger",
              },
              status: "read",
            },
            {
              id: "msg2",
              sender: {
                name: "Ali Alawi",
                role: "Gestionnaire",
                isOnline: true,
              },
              content: "Vérifiez particulièrement la pression et l'état des raccords",
              timestamp: "09:20",
              status: "read",
            },
            {
              id: "msg3",
              sender: {
                name: "Mohammed Salim",
                role: "Technicien",
                isOnline: true,
              },
              content: "Mesures effectuées :\n- Pression : 6 bars\n- Débit : 60m³/h\n- Raccords en bon état\n- Joint torique à surveiller",
              timestamp: "09:45",
              status: "read",
            },
            {
              id: "msg4",
              sender: {
                name: "Ahmed Benali",
                role: "Pompier",
                isOnline: false,
              },
              content: "La pression est conforme aux normes. Prochaine inspection dans 6 mois.",
              timestamp: "10:00",
              status: "read",
            }
          ],
          "conv2": [
            {
              id: "msg5",
              sender: {
                name: "Omar Alami",
                role: "Technicien",
                isOnline: true,
              },
              content: "Inspection de l'hydrant H-TET-018 terminée. Problèmes identifiés :",
              timestamp: "11:30",
              status: "read",
            },
            {
              id: "msg6",
              sender: {
                name: "Omar Alami",
                role: "Technicien",
                isOnline: true,
              },
              content: "1. Vanne principale présente des signes d'usure\n2. Pression mesurée : 4.5 bars (sous la norme)\n3. Légère corrosion sur le corps",
              timestamp: "11:32",
              status: "read",
            },
            {
              id: "msg7",
              sender: {
                name: "Laila Bennani",
                role: "Gestionnaire",
                isOnline: false,
              },
              content: "Programmation du remplacement de la vanne pour la semaine prochaine. Prévoir aussi un traitement anti-corrosion.",
              timestamp: "11:40",
              status: "sent",
            }
          ],
          "conv3": [
            {
              id: "msg8",
              sender: {
                name: "Rachid Moussaoui",
                role: "Technicien",
                isOnline: true,
              },
              content: "🚨 URGENT : Fuite importante détectée sur H-AHC-067 !\nPerte d'eau estimée : 2m³/h",
              timestamp: "14:15",
              isEmergency: true,
              status: "read",
            },
            {
              id: "msg9",
              sender: {
                name: "Aicha Kadiri",
                role: "Gestionnaire",
                isOnline: true,
              },
              content: "Équipe d'intervention envoyée immédiatement. Isolez la zone.",
              timestamp: "14:17",
              status: "read",
            },
            {
              id: "msg10",
              sender: {
                name: "Hassan Berrada",
                role: "Pompier",
                isOnline: true,
              },
              content: "Je suis sur place. La fuite provient du joint principal. Besoin d'une équipe de réparation d'urgence.",
              timestamp: "14:25",
              status: "sent",
            }
          ],
          "conv4": [
            {
              id: "msg11",
              sender: {
                name: "Leila Fassi",
                role: "Technicien",
                isOnline: true,
              },
              content: "Planification inspection annuelle hydrant H-TNG-156 :\n- Test de pression\n- Vérification vannes\n- Contrôle anti-gel\n- Test de débit",
              timestamp: "15:00",
              status: "read",
            },
            {
              id: "msg12",
              sender: {
                name: "Sofia El Amrani",
                role: "Technicien",
                isOnline: true,
              },
              content: "Inspection validée pour demain 9h. Préparez le rapport complet.",
              timestamp: "15:15",
              status: "read",
            },
            {
              id: "msg13",
              sender: {
                name: "Kamal Tazi",
                role: "Pompier",
                isOnline: false,
              },
              content: "Je serai présent pour superviser les tests de débit.",
              timestamp: "15:30",
              status: "delivered",
            }
          ]
        }

        setMessages(mockMessages[selectedConversation] || [])
        setIsLoading(false)

        // Marquer la conversation comme lue
        setConversations(prevConversations =>
          prevConversations.map(conv =>
            conv.id === selectedConversation
              ? { ...conv, unread: 0 }
              : conv
          )
        )
      }

      fetchMessages()
    }
  }, [selectedConversation])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    // Add the new message to the conversation
    const newMsg: Message = {
      id: `msg${messages.length + 1}`,
      sender: {
        name: "Vous",
        role: "Technicien",
        isOnline: true,
      },
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
    }

    setMessages([...messages, newMsg])
    setNewMessage("")

    // Update the conversation list
    setConversations(
      conversations.map((conv) =>
        conv.id === selectedConversation
          ? {
              ...conv,
              lastMessage: newMessage,
              timestamp: "À l'instant",
              unread: 0,
            }
          : conv,
      ),
    )

    // Simulate message delivery
    setTimeout(() => {
      setMessages((prev) => prev.map((msg) => (msg.id === newMsg.id ? { ...msg, status: "delivered" } : msg)))
    }, 1000)

    // Simulate typing indicator
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      // Simulate a response
      const responseMsg: Message = {
        id: `msg${messages.length + 2}`,
        sender: {
          name: "Marie Lambert",
          role: "Gestionnaire Municipal",
          isOnline: true,
        },
        content: "Message reçu, merci pour la mise à jour !",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "sent",
      }
      setMessages((prev) => [...prev, responseMsg])
    }, 2000)
  }

  const handleEmergencyAlert = () => {
    const emergencyMsg: Message = {
      id: `emergency${Date.now()}`,
      sender: {
        name: "Vous",
        role: "Technicien",
        isOnline: true,
      },
      content: "🚨 ALERTE D'URGENCE - Intervention immédiate requise !",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isEmergency: true,
      status: "sent",
    }

    setMessages([...messages, emergencyMsg])

    toast({
      title: "Alerte d'urgence envoyée",
      description: "Tous les intervenants ont été notifiés de la situation d'urgence.",
      variant: "destructive",
    })
  }

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const locationMsg: Message = {
          id: `location${Date.now()}`,
          sender: {
            name: "Vous",
            role: "Technicien",
            isOnline: true,
          },
          content: "📍 Position partagée",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: "Position actuelle",
          },
          status: "sent",
        }

        setMessages([...messages, locationMsg])
        toast({
          title: "Position partagée",
          description: "Votre position a été partagée avec l'équipe.",
        })
      })
    }
  }

  const handleCreateConversation = () => {
    if (!newConversationTitle.trim()) return

    const newConv: Conversation = {
      id: `conv${conversations.length + 1}`,
      title: newConversationTitle,
      participants: [{ name: "Vous", role: "Technicien", isOnline: true }],
      lastMessage: "Conversation créée",
      timestamp: "À l'instant",
      unread: 0,
      type: newConversationType,
    }

    setConversations([newConv, ...conversations])
    setSelectedConversation(newConv.id)
    setShowNewConversation(false)
    setNewConversationTitle("")

    toast({
      title: "Conversation créée",
      description: `Nouvelle ${newConversationType === "group" ? "conversation de groupe" : "conversation directe"} créée.`,
    })
  }

  const handleConversationClick = (conversationId: string) => {
    setSelectedConversation(conversationId)
    setNewMessage("")
  }

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-700"></div>
      </div>
    )
  }

  return (
    <div className="flex h-full">
      {/* Conversations list */}
      <div className="w-full border-r md:w-80">
        <div className="border-b p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Conversations</h2>
            <div className="flex gap-2">
              <Dialog open={showNewConversation} onOpenChange={setShowNewConversation}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nouvelle conversation</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Titre</Label>
                      <Input
                        id="title"
                        value={newConversationTitle}
                        onChange={(e) => setNewConversationTitle(e.target.value)}
                        placeholder="Nom de la conversation"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={newConversationType}
                        onValueChange={(value: "group" | "direct") => setNewConversationType(value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="group">Groupe</SelectItem>
                          <SelectItem value="direct">Direct</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleCreateConversation} className="w-full">
                      Créer
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="destructive" size="sm" onClick={handleEmergencyAlert}>
                <AlertTriangle className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`cursor-pointer border-b p-4 hover:bg-muted/50 ${
                selectedConversation === conversation.id ? "bg-muted" : ""
              }`}
              onClick={() => handleConversationClick(conversation.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{conversation.title}</h3>
                    {conversation.isEmergency && (
                      <Badge variant="destructive" className="h-5 px-1">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Urgent
                      </Badge>
                    )}
                    {conversation.type === "direct" && (
                      <Badge variant="secondary" className="h-5 px-1">
                        Direct
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{conversation.lastMessage}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                  {conversation.unread > 0 && (
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                      {conversation.unread}
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span>{conversation.participants.length} participants</span>
                <span className="ml-2 flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  {conversation.participants.filter((p) => p.isOnline).length} en ligne
                </span>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Messages */}
      <div className="flex flex-1 flex-col">
        {selectedConversation ? (
          <>
            <div className="border-b p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    {conversations.find((c) => c.id === selectedConversation)?.title}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {conversations.find((c) => c.id === selectedConversation)?.participants.length} participants
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      {
                        conversations.find((c) => c.id === selectedConversation)?.participants.filter((p) => p.isOnline)
                          .length
                      }{" "}
                      en ligne
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Informations du groupe</DropdownMenuItem>
                      <DropdownMenuItem>Ajouter des participants</DropdownMenuItem>
                      <DropdownMenuItem>Quitter la conversation</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender.name === "Vous" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender.name === "Vous"
                          ? message.isEmergency
                            ? "bg-red-600 text-white"
                            : "bg-blue-600 text-white"
                          : message.isEmergency
                            ? "bg-red-100 border border-red-300"
                            : "bg-muted"
                      }`}
                    >
                      {message.sender.name !== "Vous" && (
                        <div className="mb-1 flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>
                              {message.sender.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{message.sender.name}</span>
                            <span className="text-xs text-muted-foreground">{message.sender.role}</span>
                            {message.sender.isOnline && <div className="h-2 w-2 rounded-full bg-green-500"></div>}
                          </div>
                        </div>
                      )}
                      <p className={`text-sm ${message.sender.name === "Vous" ? "text-white" : "text-foreground"}`}>
                        {message.content}
                      </p>
                      {message.attachment && (
                        <div className="mt-2">
                          {message.attachment.type === "image" ? (
                            <img
                              src={message.attachment.url || "/placeholder.svg"}
                              alt={message.attachment.name}
                              className="rounded max-w-full h-auto"
                              style={{ maxHeight: "200px" }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = "/placeholder.svg?height=200&width=300"
                              }}
                            />
                          ) : (
                            <div className="flex items-center gap-2 p-2 bg-white/10 rounded">
                              <Paperclip className="h-4 w-4" />
                              <span className="text-sm">{message.attachment.name}</span>
                            </div>
                          )}
                        </div>
                      )}
                      {message.location && (
                        <div
                          className={`mt-2 flex items-center gap-1 text-xs ${
                            message.sender.name === "Vous" ? "text-blue-100" : "text-muted-foreground"
                          }`}
                        >
                          <MapPin className="h-3 w-3" />
                          <span>{message.location.address}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-1">
                        <div
                          className={`text-xs ${
                            message.sender.name === "Vous" ? "text-blue-100" : "text-muted-foreground"
                          }`}
                        >
                          {message.timestamp}
                        </div>
                        {message.sender.name === "Vous" && (
                          <div className="flex items-center">
                            {message.status === "sent" && <Check className="h-3 w-3 text-blue-100" />}
                            {message.status === "delivered" && <CheckCheck className="h-3 w-3 text-blue-100" />}
                            {message.status === "read" && <CheckCheck className="h-3 w-3 text-green-300" />}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex items-center gap-1">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></div>
                          <div
                            className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span className="text-xs text-muted-foreground ml-2">En train d'écrire...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="border-t p-4">
              <form onSubmit={handleSendMessage} className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleShareLocation}
                    title="Partager ma position"
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="outline" size="icon" title="Joindre un fichier">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="outline" size="icon" title="Prendre une photo">
                    <Camera className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="outline" size="icon" title="Message vocal">
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Tapez votre message..."
                    className="flex-1 min-h-[40px] max-h-[120px]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage(e)
                      }
                    }}
                  />
                  <Button type="submit" size="icon" className="shrink-0">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-4">
            <MessageSquare className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Sélectionnez une conversation</h3>
            <p className="mt-2 text-center text-muted-foreground">
              Cliquez sur une conversation pour afficher les messages
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
