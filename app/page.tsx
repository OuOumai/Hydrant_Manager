"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { authenticate, getRoleName } from "@/src/auth/auth"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validation des champs
    if (!username.trim()) {
      toast({
        title: "Erreur de connexion",
        description: "Veuillez entrer votre nom d'utilisateur",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (!password.trim()) {
      toast({
        title: "Erreur de connexion",
        description: "Veuillez entrer votre mot de passe",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (!selectedRole) {
      toast({
        title: "Erreur de connexion",
        description: "Veuillez sélectionner votre profil",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (isLocked) {
      toast({
        title: "Compte temporairement bloqué",
        description: "Veuillez réessayer dans 30 minutes ou réinitialiser votre mot de passe",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      console.log("Tentative de connexion avec:", { username, password, selectedRole })
      const user = authenticate(username, password)
      console.log("Résultat de l'authentification:", user)
      
      if (user && user.role === selectedRole) {
        // Reset login attempts on successful login
        setLoginAttempts(0)
        
        // Store user data in localStorage with all necessary fields
        const userData = {
          username: user.name,
          name: user.name,
          role: user.role,
          email: user.email
        }
        console.log("Stockage des données utilisateur:", userData)
        localStorage.setItem("user", JSON.stringify(userData))
        
        // Show success toast
        toast({
          title: "Connexion réussie",
          description: `Bienvenue ${user.name}`,
        })

        // Redirect to dashboard with a small delay to ensure localStorage is set
        setTimeout(() => {
          router.push("/dashboard")
        }, 100)
      } else {
        // Increment login attempts
        const newAttempts = loginAttempts + 1
        setLoginAttempts(newAttempts)

        // Lock account after 3 failed attempts
        if (newAttempts >= 3) {
          setIsLocked(true)
          setTimeout(() => {
            setIsLocked(false)
            setLoginAttempts(0)
          }, 1800000) // 30 minutes
        }

        toast({
          title: "Erreur de connexion",
          description: user 
            ? "Le profil sélectionné ne correspond pas à votre compte" 
            : `Nom d'utilisateur ou mot de passe incorrect (${3 - newAttempts} tentatives restantes)`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate sending reset email
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: "Email envoyé",
        description: "Les instructions de réinitialisation ont été envoyées à votre adresse email",
      })
      
      setShowForgotPassword(false)
      setResetEmail("")
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de l'email",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>
            Connectez-vous pour accéder à votre compte
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              {isLocked && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Compte temporairement bloqué. Veuillez réessayer dans 30 minutes ou réinitialiser votre mot de passe.
                  </AlertDescription>
                </Alert>
              )}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="role">Profil</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Sélectionnez votre profil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technician">Technicien</SelectItem>
                    <SelectItem value="firefighter">Pompier</SelectItem>
                    <SelectItem value="municipal">Gestionnaire Municipal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  placeholder="Entrez votre nom complet"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Entrez votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Mot de passe par défaut : 1234
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>
            <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
              <DialogTrigger asChild>
                <Button variant="link" className="text-sm text-gray-500 hover:text-gray-700">
                  Mot de passe oublié ?
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Réinitialiser le mot de passe</DialogTitle>
                  <DialogDescription>
                    Entrez votre adresse email pour recevoir les instructions de réinitialisation.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="nom@exemple.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Envoi en cours..." : "Envoyer les instructions"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
