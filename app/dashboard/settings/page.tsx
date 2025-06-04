"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<any[]>([])
  const { toast } = useToast()

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setUsers([
        {
          id: 1,
          name: "Mohammed Salim",
          email: "mohammed.salim@technician.hyd.ma",
          role: "technician",
          status: "active",
          lastLogin: "20/05/2024, 10:23",
          department: "Service Technique - Tanger",
          phone: "+212 6 61 23 45 67"
        },
        {
          id: 2,
          name: "Ali Alawi",
          email: "ali.alawi@municipal.hyd.ma",
          role: "municipal",
          status: "active",
          lastLogin: "19/05/2024, 15:47",
          department: "Service Municipal - Tétouan",
          phone: "+212 6 62 34 56 78"
        },
        {
          id: 3,
          name: "Ahmed Benali",
          email: "ahmed.benali@firefighter.hyd.ma",
          role: "firefighter",
          status: "active",
          lastLogin: "18/05/2024, 09:12",
          department: "Protection Civile - Al Hoceima",
          phone: "+212 6 63 45 67 89"
        },
        {
          id: 4,
          name: "Omar Alami",
          email: "omar.alami@technician.hyd.ma",
          role: "technician",
          status: "active",
          lastLogin: "17/05/2024, 14:30",
          department: "Service Technique - Tanger",
          phone: "+212 6 64 56 78 90"
        },
        {
          id: 5,
          name: "Laila Bennani",
          email: "laila.bennani@municipal.hyd.ma",
          role: "municipal",
          status: "active",
          lastLogin: "17/05/2024, 11:05",
          department: "Service Municipal - Tétouan",
          phone: "+212 6 65 67 89 01"
        },
        {
          id: 6,
          name: "Youssef Tazi",
          email: "youssef.tazi@firefighter.hyd.ma",
          role: "firefighter",
          status: "active",
          lastLogin: "16/05/2024, 16:20",
          department: "Protection Civile - Tanger",
          phone: "+212 6 66 78 90 12"
        },
        {
          id: 7,
          name: "Rachid Moussaoui",
          email: "rachid.moussaoui@technician.hyd.ma",
          role: "technician",
          status: "active",
          lastLogin: "16/05/2024, 09:45",
          department: "Service Technique - Al Hoceima",
          phone: "+212 6 67 89 01 23"
        },
        {
          id: 8,
          name: "Aicha Kadiri",
          email: "aicha.kadiri@municipal.hyd.ma",
          role: "municipal",
          status: "active",
          lastLogin: "15/05/2024, 13:15",
          department: "Service Municipal - Tanger",
          phone: "+212 6 68 90 12 34"
        },
        {
          id: 9,
          name: "Hassan Berrada",
          email: "hassan.berrada@firefighter.hyd.ma",
          role: "firefighter",
          status: "active",
          lastLogin: "15/05/2024, 10:30",
          department: "Protection Civile - Tétouan",
          phone: "+212 6 69 01 23 45"
        },
        {
          id: 10,
          name: "Karim Idrissi",
          email: "karim.idrissi@technician.hyd.ma",
          role: "technician",
          status: "active",
          lastLogin: "14/05/2024, 17:00",
          department: "Service Technique - Tétouan",
          phone: "+212 6 70 12 34 56"
        },
        {
          id: 11,
          name: "Leila Fassi",
          email: "leila.fassi@technician.hyd.ma",
          role: "technician",
          status: "active",
          lastLogin: "14/05/2024, 11:20",
          department: "Service Technique - Tanger",
          phone: "+212 6 71 23 45 67"
        },
        {
          id: 12,
          name: "Sofia El Amrani",
          email: "sofia.elamrani@technician.hyd.ma",
          role: "technician",
          status: "active",
          lastLogin: "13/05/2024, 15:40",
          department: "Service Technique - Al Hoceima",
          phone: "+212 6 72 34 56 78"
        },
        {
          id: 13,
          name: "Kamal Tazi",
          email: "kamal.tazi@firefighter.hyd.ma",
          role: "firefighter",
          status: "active",
          lastLogin: "13/05/2024, 09:00",
          department: "Protection Civile - Al Hoceima",
          phone: "+212 6 73 45 67 89"
        },
      ])
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleSaveProfile = () => {
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été enregistrées avec succès.",
    })
  }

  const handleSaveNotifications = () => {
    toast({
      title: "Préférences de notification mises à jour",
      description: "Vos préférences ont été enregistrées avec succès.",
    })
  }

  const handleSaveSecurity = () => {
    toast({
      title: "Paramètres de sécurité mis à jour",
      description: "Vos paramètres ont été enregistrés avec succès.",
    })
  }

  const getRoleName = (role: string) => {
    switch (role) {
      case "firefighter":
        return "Pompier"
      case "technician":
        return "Technicien"
      case "municipal":
        return "Gestionnaire Municipal"
      case "civil_protection":
        return "Protection Civile"
      default:
        return role
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-700"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Paramètres du système</h1>
        <p className="text-muted-foreground">Gérez vos préférences et les utilisateurs du système</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informations du profil</CardTitle>
              <CardDescription>Modifiez vos informations personnelles et professionnelles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input 
                  id="name" 
                  placeholder="Entrez votre nom complet"
                  defaultValue="" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email professionnel</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="prenom.nom@role.hyd.ma"
                  defaultValue="" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone de service</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="0X XX XX XX XX"
                  defaultValue="" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Service</Label>
                <Input 
                  id="department" 
                  placeholder="Votre service"
                  defaultValue="" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zone">Zone d'intervention</Label>
                <Input 
                  id="zone" 
                  placeholder="Votre zone d'intervention"
                  defaultValue="" 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile}>Enregistrer les modifications</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notification</CardTitle>
              <CardDescription>Configurez les notifications relatives aux hydrants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alertes de maintenance</Label>
                  <p className="text-sm text-muted-foreground">Notifications pour les maintenances planifiées</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alertes de dysfonctionnement</Label>
                  <p className="text-sm text-muted-foreground">Notifications en cas de panne ou problème</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Rapports hebdomadaires</Label>
                  <p className="text-sm text-muted-foreground">Résumé hebdomadaire de l'état des hydrants</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications de pression</Label>
                  <p className="text-sm text-muted-foreground">Alertes en cas de variation importante de pression</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications}>Enregistrer les préférences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de sécurité</CardTitle>
              <CardDescription>Sécurisez votre accès au système</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Mot de passe actuel</Label>
                <Input 
                  id="current-password" 
                  type="password" 
                  placeholder="Entrez votre mot de passe actuel"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input 
                  id="new-password" 
                  type="password" 
                  placeholder="Entrez votre nouveau mot de passe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input 
                  id="confirm-password" 
                  type="password" 
                  placeholder="Confirmez votre nouveau mot de passe"
                />
              </div>
              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5">
                  <Label>Authentification à deux facteurs (2FA)</Label>
                  <p className="text-sm text-muted-foreground">Protection supplémentaire pour votre compte</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Localisation obligatoire</Label>
                  <p className="text-sm text-muted-foreground">Exiger la localisation pour les interventions</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSecurity}>Mettre à jour la sécurité</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des utilisateurs</CardTitle>
              <CardDescription>Gérez les utilisateurs et leurs rôles</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Dernière connexion</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => {
                    const emailName = user.name.toLowerCase().replace(" ", ".")
                    return (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{emailName}@{user.role}.hyd.ma</TableCell>
                        <TableCell>{getRoleName(user.role)}</TableCell>
                        <TableCell>
                          {user.status === "active" ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Actif
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                              Inactif
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{user.lastLogin}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            Modifier
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button>Ajouter un utilisateur</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
