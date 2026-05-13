import { createClient } from "@/lib/supabase/server"
import type { Event } from "@/types"

export async function getUpcomingEvents(limit?: number): Promise<Event[]> {
  try {
    const supabase = await createClient()
    let query = supabase
      .from("events")
      .select("*")
      .gte("event_date", new Date().toISOString())
      .order("event_date", { ascending: true })

    if (limit) query = query.limit(limit)

    const { data, error } = await query
    if (error) {
      console.error("getUpcomingEvents error:", error)
      return []
    }
    return data ?? []
  } catch (err) {
    console.error("getUpcomingEvents exception:", err)
    return []
  }
}

export async function getPastEvents(limit?: number): Promise<Event[]> {
  try {
    const supabase = await createClient()
    let query = supabase
      .from("events")
      .select("*")
      .lt("event_date", new Date().toISOString())
      .order("event_date", { ascending: false })

    if (limit) query = query.limit(limit)

    const { data, error } = await query
    if (error) {
      console.error("getPastEvents error:", error)
      return []
    }
    return data ?? []
  } catch (err) {
    console.error("getPastEvents exception:", err)
    return []
  }
}

export async function getPaginatedEvents(options: {
  page: number
  pageSize: number
  filter: "all" | "upcoming" | "past"
}): Promise<{ data: Event[]; count: number }> {
  const { page, pageSize, filter } = options
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  const now = new Date().toISOString()

  try {
    const supabase = await createClient()
    let query = supabase.from("events").select("*", { count: "exact" })

    if (filter === "upcoming") {
      query = query.gte("event_date", now).order("event_date", { ascending: true })
    } else if (filter === "past") {
      query = query.lt("event_date", now).order("event_date", { ascending: false })
    } else {
      query = query.order("event_date", { ascending: false })
    }

    const { data, error, count } = await query.range(from, to)

    if (error) {
      console.error("getPaginatedEvents error:", error)
      return { data: [], count: 0 }
    }
    return { data: data ?? [], count: count ?? 0 }
  } catch (err) {
    console.error("getPaginatedEvents exception:", err)
    return { data: [], count: 0 }
  }
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .single()

    if (error) {
      console.error("getEventBySlug error:", error)
      return null
    }
    return data
  } catch (err) {
    console.error("getEventBySlug exception:", err)
    return null
  }
}

export async function getHomePageEvents(): Promise<Event[]> {
  try {
    const supabase = await createClient()
    const now = new Date().toISOString()

    const { data: featured } = await supabase
      .from("events")
      .select("*")
      .eq("is_featured", true)
      .gte("event_date", now)
      .order("event_date", { ascending: true })
      .limit(3)

    if (featured && featured.length >= 3) return featured.slice(0, 3)

    const featuredIds = (featured ?? []).map((e: Event) => e.id)
    const remaining = 3 - (featured?.length ?? 0)

    let upcomingQuery = supabase
      .from("events")
      .select("*")
      .gte("event_date", now)
      .order("event_date", { ascending: true })
      .limit(remaining + featuredIds.length)

    if (featuredIds.length > 0) {
      upcomingQuery = upcomingQuery.not("id", "in", `(${featuredIds.join(",")})`)
    }

    const { data: upcoming } = await upcomingQuery

    const combined = [...(featured ?? []), ...(upcoming ?? [])].slice(0, 3)
    return combined
  } catch (err) {
    console.error("getHomePageEvents exception:", err)
    return []
  }
}

export async function getAllEventSlugs(): Promise<string[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("events").select("slug")
    if (error) return []
    return (data ?? []).map((e: { slug: string }) => e.slug)
  } catch {
    return []
  }
}
