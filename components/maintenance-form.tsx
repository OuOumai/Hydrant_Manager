"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Hydrant } from "@/types/hydrant"
import { useToast } from "@/hooks/use-toast"

interface MaintenanceFormProps {
  hydrant: Hydrant
  onCancel: () => void
  onComplete: () => void
}

export function MaintenanceForm({ hydrant, onCancel, onComplete }: MaintenanceFormProps) {
  const [interventionType, setInterventionType] = useState("")
  const [duration, setDuration] = useState("")
  const [remarks, setRemarks] = useState("")
  const [finalStatus, setFinalStatus] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Intervention enregistrée",
        description: `L'intervention sur l'hydrant ${hydrant.id} a été enregistrée avec succès.`,
      })

      onComplete()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de l'intervention.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="intervention-type">Type d'intervention</Label>
        <Select value={interventionType} onValueChange={setInterventionType} required>
          <SelectTrigger id="intervention-type">
            <SelectValue placeholder="Sélectionner le type d'intervention" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="inspection">Inspection</SelectItem>
            <SelectItem value="repair">Réparation</SelectItem>
            <SelectItem value="replacement">Remplacement</SelectItem>
            <SelectItem value="cleaning">Nettoyage</SelectItem>
            <SelectItem value="other">Autre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Durée estimée (minutes)</Label>
        <Input
          id="duration"
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Durée en minutes"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="remarks">Remarques</Label>
        <Textarea
          id="remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Détails de l'intervention"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="final-status">Statut final</Label>
        <Select value={finalStatus} onValueChange={setFinalStatus} required>
          <SelectTrigger id="final-status">
            <SelectValue placeholder="Sélectionner le statut final" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="functional">Fonctionnel</SelectItem>
            <SelectItem value="maintenance">En maintenance</SelectItem>
            <SelectItem value="outOfOrder">Hors service</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Photos</Label>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col items-center justify-center h-32 border border-dashed rounded-md bg-muted/50 cursor-pointer hover:bg-muted/70">
            <span className="text-xs text-muted-foreground">Avant</span>
            <span className="text-xs text-muted-foreground">+ Ajouter</span>
          </div>
          <div className="flex flex-col items-center justify-center h-32 border border-dashed rounded-md bg-muted/50 cursor-pointer hover:bg-muted/70">
            <span className="text-xs text-muted-foreground">Après</span>
            <span className="text-xs text-muted-foreground">+ Ajouter</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : "Enregistrer l'intervention"}
        </Button>
      </div>
    </form>
  )
}
