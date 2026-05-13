import { createClient, createStaticClient } from "@/lib/supabase/server"
import type { Guide, GuideSection } from "@/types"

export async function getPublishedGuides(): Promise<Guide[]> {
  const supabase = createStaticClient()
  const { data, error } = await supabase
    .from("guides")
    .select("*")
    .eq("published", true)
    .order("unit_code")
    .order("year_level")
  if (error) { console.error("getPublishedGuides:", error); return [] }
  return data ?? []
}

export async function getGuidesByYear(yearLevel: number): Promise<Guide[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("guides")
    .select("*")
    .eq("published", true)
    .eq("year_level", yearLevel)
    .order("unit_code")
  if (error) { console.error("getGuidesByYear:", error); return [] }
  return data ?? []
}

export async function getGuideBySlug(slug: string): Promise<Guide | null> {
  const supabase = await createClient()
  const { data: guide, error } = await supabase
    .from("guides")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single()
  if (error || !guide) return null

  const { data: sections } = await supabase
    .from("guide_sections")
    .select("*")
    .eq("guide_id", guide.id)
    .order("display_order")

  return { ...guide, sections: sections ?? [] }
}

export async function getAllGuidesAdmin(): Promise<Guide[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("guides")
    .select("*")
    .order("unit_code")
  if (error) { console.error("getAllGuidesAdmin:", error); return [] }
  return data ?? []
}

export async function getGuideSections(guideId: string): Promise<GuideSection[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("guide_sections")
    .select("*")
    .eq("guide_id", guideId)
    .order("display_order")
  if (error) { console.error("getGuideSections:", error); return [] }
  return data ?? []
}
