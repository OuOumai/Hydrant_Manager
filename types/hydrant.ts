export interface Hydrant {
  id: string
  lat: number
  lng: number
  address: string
  status: "functional" | "maintenance" | "outOfOrder"
  type: string
  capacity: number
  lastInspection: string
  nextInspection: string
  pressure: number
  flowRate: number
  waterLevel: number
  temperature: number
  history: {
    type: "inspection" | "maintenance" | "issue"
    title: string
    date: string
    description: string
  }[]
}
