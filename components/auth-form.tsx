"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function AuthForm() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!username || !password || !role) {
      setError("Veuillez remplir tous les champs")
      return
    }

    setIsLoading(true)

    // Simulate authentication
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Store user info in localStorage (in a real app, use secure cookies or tokens)
      localStorage.setItem("user", JSON.stringify({ username, role }))

      // Redirect based on role
      router.push("/dashboard")
    } catch (err) {
      setError("Erreur d'authentification. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
        <CardDescription>Connectez-vous pour accéder à l'application de gestion des hydrants</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Nom d'utilisateur</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Entrez votre nom d'utilisateur"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <Select value={role} onValueChange={setRole} required>
              <SelectTrigger id="role">
                <SelectValue placeholder="Sélectionnez votre rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="firefighter">Pompier</SelectItem>
                <SelectItem value="technician">Technicien</SelectItem>
                <SelectItem value="municipal">Gestionnaire Municipal</SelectItem>
                <SelectItem value="civil_protection">Protection Civile</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="link" className="px-0">
          Mot de passe oublié ?
        </Button>
      </CardFooter>
    </Card>
  )
}
