export interface Event {
  id: string
  title: string
  slug: string
  description?: string
  long_description?: string
  event_date: string
  end_date?: string
  location?: string
  address?: string
  image_url?: string
  registration_url?: string
  registration_label?: string
  is_featured: boolean
  tags?: string[]
  capacity?: number
  price?: string
  created_at: string
  updated_at: string
}

export interface GuideSection {
  id: string
  guide_id: string
  question: string
  answer: string
  display_order: number
}

export interface Guide {
  id: string
  title: string
  slug: string
  unit_code: string
  unit_name: string
  intro?: string
  content?: string
  final_notes?: string
  author?: string
  cover_image_url?: string
  difficulty?: "easy" | "medium" | "hard"
  year_level?: number
  tags?: string[]
  published: boolean
  read_time_minutes?: number
  created_at: string
  updated_at: string
  sections?: GuideSection[]
}

export interface CabinetMember {
  id: string
  name: string
  role: string
  bio?: string
  image_url?: string
  linkedin_url?: string
  display_order: number
  year: number
}

export interface Sponsor {
  id: string
  name: string
  logo_url?: string
  website_url?: string
  tier: "platinum" | "gold" | "silver" | "bronze"
  display_order: number
  active: boolean
}
