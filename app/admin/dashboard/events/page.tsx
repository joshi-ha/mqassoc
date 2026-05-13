"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  Plus, Pencil, Trash2, X, Calendar, Star, Copy,
  Search, Upload, Download, ChevronDown, ChevronUp, AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { slugify, parseTags } from "@/lib/utils"
import { useToast, ToastContainer } from "@/components/ui/Toast"
import { parseCSV, generateCSVTemplate, downloadCSV, CSV_TEMPLATE_HEADERS } from "@/lib/csv"
import type { Event } from "@/types"

// ─── Types ───────────────────────────────────────────────────────────────────

type FormData = Omit<Event, "id" | "created_at" | "updated_at" | "is_past"> & {
  tagsInput: string
}

const EMPTY_FORM: FormData = {
  title: "",
  slug: "",
  description: "",
  long_description: "",
  event_date: "",
  end_date: "",
  location: "",
  address: "",
  image_url: "",
  registration_url: "",
  registration_label: "Register Now",
  is_featured: false,
  tags: [],
  tagsInput: "",
  capacity: undefined,
  price: "Free",
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showCSVModal, setShowCSVModal] = useState(false)
  const [editing, setEditing] = useState<Event | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const { toasts, addToast, removeToast } = useToast()

  const supabase = createClient()

  const loadEvents = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: false })
    if (error) console.error("Load events error:", error)
    setEvents(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { loadEvents() }, [loadEvents])

  // Stats
  const now = new Date().toISOString()
  const upcoming = events.filter((e) => e.event_date >= now).length
  const past = events.filter((e) => e.event_date < now).length

  // Filtered by search
  const filtered = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase())
  )

  // ── Form helpers ────────────────────────────────────────────────────────────

  function openCreate() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setSlugManuallyEdited(false)
    setShowModal(true)
  }

  function openEdit(event: Event) {
    setEditing(event)
    setForm({
      title: event.title,
      slug: event.slug,
      description: event.description ?? "",
      long_description: event.long_description ?? "",
      event_date: event.event_date ? event.event_date.slice(0, 16) : "",
      end_date: event.end_date ? event.end_date.slice(0, 16) : "",
      location: event.location ?? "",
      address: event.address ?? "",
      image_url: event.image_url ?? "",
      registration_url: event.registration_url ?? "",
      registration_label: event.registration_label ?? "Register Now",
      is_featured: event.is_featured,
      tags: event.tags ?? [],
      tagsInput: (event.tags ?? []).join(", "),
      capacity: event.capacity,
      price: event.price ?? "Free",
    })
    setSlugManuallyEdited(true)
    setShowModal(true)
  }

  function openDuplicate(event: Event) {
    setEditing(null)
    setForm({
      title: event.title,
      slug: event.slug + "-copy",
      description: event.description ?? "",
      long_description: event.long_description ?? "",
      event_date: "",
      end_date: "",
      location: event.location ?? "",
      address: event.address ?? "",
      image_url: event.image_url ?? "",
      registration_url: event.registration_url ?? "",
      registration_label: event.registration_label ?? "Register Now",
      is_featured: false,
      tags: event.tags ?? [],
      tagsInput: (event.tags ?? []).join(", "),
      capacity: event.capacity,
      price: event.price ?? "Free",
    })
    setSlugManuallyEdited(true)
    setShowModal(true)
  }

  function updateTitle(value: string) {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: slugManuallyEdited ? prev.slug : slugify(value),
    }))
  }

  function updateTagsInput(value: string) {
    setForm((prev) => ({
      ...prev,
      tagsInput: value,
      tags: parseTags(value),
    }))
  }

  async function ensureUniqueSlug(base: string, excludeId?: string): Promise<string> {
    let slug = base
    let attempt = 0
    while (true) {
      let query = supabase.from("events").select("id").eq("slug", slug)
      if (excludeId) query = query.neq("id", excludeId)
      const { data } = await query
      if (!data?.length) return slug
      attempt++
      slug = `${base}-${attempt + 1}`
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const tags = parseTags(form.tagsInput)
    const finalSlug = await ensureUniqueSlug(form.slug || slugify(form.title), editing?.id)

    const payload = {
      title: form.title,
      slug: finalSlug,
      description: form.description || null,
      long_description: form.long_description || null,
      event_date: form.event_date,
      end_date: form.end_date || null,
      location: form.location || null,
      address: form.address || null,
      image_url: form.image_url || null,
      registration_url: form.registration_url || null,
      registration_label: form.registration_label || "Register Now",
      is_featured: form.is_featured,
      tags: tags.length ? tags : null,
      capacity: form.capacity ?? null,
      price: form.price || "Free",
    }

    if (editing) {
      const { error } = await supabase.from("events").update(payload).eq("id", editing.id)
      if (error) { addToast("Failed to update event.", "error") }
      else { addToast("Event updated successfully.") }
    } else {
      const { error } = await supabase.from("events").insert([payload])
      if (error) { addToast("Failed to create event.", "error") }
      else { addToast("Event created successfully.") }
    }

    setSaving(false)
    setShowModal(false)
    loadEvents()
  }

  async function handleToggleFeatured(event: Event) {
    const { error } = await supabase
      .from("events")
      .update({ is_featured: !event.is_featured })
      .eq("id", event.id)
    if (error) { addToast("Failed to update featured status.", "error") }
    else {
      setEvents((prev) =>
        prev.map((e) => e.id === event.id ? { ...e, is_featured: !e.is_featured } : e)
      )
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const { error } = await supabase.from("events").delete().eq("id", deleteTarget.id)
    if (error) { addToast("Failed to delete event.", "error") }
    else { addToast(`"${deleteTarget.title}" deleted.`) }
    setShowDeleteModal(false)
    setDeleteTarget(null)
    loadEvents()
  }

  // ── Image preview ───────────────────────────────────────────────────────────
  const imageValid =
    form.image_url?.startsWith("http") &&
    /\.(jpg|jpeg|png|gif|webp|svg|avif)(\?.*)?$/i.test(form.image_url)

  return (
    <div className="p-6 lg:p-8">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl text-text">Manage Events</h1>
          <p className="text-muted mt-1 text-sm">Add, edit, and organise ASSOC events.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="cream" size="sm" onClick={() => setShowCSVModal(true)}>
            <Upload size={14} /> Import CSV
          </Button>
          <Button size="sm" onClick={openCreate}>
            <Plus size={14} /> Add Event
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total", value: events.length, color: "text-primary" },
          { label: "Upcoming", value: upcoming, color: "text-emerald-600" },
          { label: "Past", value: past, color: "text-muted" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-border p-4 shadow-sm text-center">
            <p className={cn("font-display text-3xl", stat.color)}>{stat.value}</p>
            <p className="text-xs text-muted mt-0.5 font-medium uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        <input
          type="text"
          placeholder="Search events by title…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-input pl-9"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-14 text-center">
            <Calendar size={32} className="text-muted mx-auto mb-3" />
            <p className="font-display text-xl text-text mb-1">
              {search ? "No matching events" : "No events yet"}
            </p>
            <p className="text-sm text-muted">
              {search ? "Try a different search term." : "Add your first event to get started."}
            </p>
          </div>
        ) : (
          <table className="w-full min-w-160">
            <thead>
              <tr className="border-b border-border bg-cream">
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted">Title</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted">Date</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted hidden lg:table-cell">Location</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted hidden sm:table-cell">Price</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted">Featured</th>
                <th className="px-5 py-3.5 w-28" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((event) => {
                const isPast = event.event_date < now
                return (
                  <tr
                    key={event.id}
                    className={cn(
                      "border-b border-border last:border-0 transition-colors",
                      isPast ? "bg-cream/40 hover:bg-cream/60" : "hover:bg-cream/30"
                    )}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <p className={cn("text-sm font-medium", isPast ? "text-muted" : "text-text")}>
                          {event.title}
                        </p>
                        {isPast && (
                          <span className="text-[10px] font-semibold uppercase tracking-wider bg-muted/15 text-muted px-1.5 py-0.5 rounded-full shrink-0">
                            Past
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted mt-0.5 font-mono">/events/{event.slug}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-muted whitespace-nowrap">
                        {new Date(event.event_date).toLocaleDateString("en-AU", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <p className="text-sm text-muted">{event.location ?? "—"}</p>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <p className="text-sm text-muted">{event.price ?? "Free"}</p>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggleFeatured(event)}
                        title={event.is_featured ? "Remove featured" : "Mark as featured"}
                        className="p-1 rounded transition-colors"
                      >
                        <Star
                          size={16}
                          className={cn(
                            "transition-colors",
                            event.is_featured
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted hover:text-amber-400"
                          )}
                        />
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => openEdit(event)}
                          title="Edit"
                          className="p-1.5 text-muted hover:text-primary hover:bg-primary/8 rounded-lg transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => openDuplicate(event)}
                          title="Duplicate"
                          className="p-1.5 text-muted hover:text-primary hover:bg-primary/8 rounded-lg transition-colors"
                        >
                          <Copy size={13} />
                        </button>
                        <button
                          onClick={() => { setDeleteTarget(event); setShowDeleteModal(true) }}
                          title="Delete"
                          className="p-1.5 text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Add / Edit Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-border shadow-2xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border sticky top-0 bg-white rounded-t-2xl z-10">
              <h2 className="font-display text-xl text-text">
                {editing ? "Edit Event" : "Add Event"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-muted hover:text-text hover:bg-cream rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Title + Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Title" required>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => updateTitle(e.target.value)}
                    className="admin-input"
                    placeholder="Event title"
                  />
                </FormField>
                <FormField label="Slug" required hint="Auto-generated from title">
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => {
                      setSlugManuallyEdited(true)
                      setForm({ ...form, slug: slugify(e.target.value) })
                    }}
                    className="admin-input font-mono text-xs"
                    placeholder="event-slug"
                  />
                </FormField>
              </div>

              {/* Short description */}
              <FormField label="Short Description" hint={`${(form.description ?? "").length}/200`}>
                <textarea
                  rows={2}
                  maxLength={200}
                  value={form.description ?? ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="admin-input resize-none"
                  placeholder="Brief summary shown on cards…"
                />
              </FormField>

              {/* Long description */}
              <FormField label="Full Description" hint="Supports paragraphs (blank line = new paragraph)">
                <textarea
                  rows={5}
                  value={form.long_description ?? ""}
                  onChange={(e) => setForm({ ...form, long_description: e.target.value })}
                  className="admin-input resize-y"
                  placeholder="Full event description…"
                />
              </FormField>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Start Date & Time" required>
                  <input
                    type="datetime-local"
                    required
                    value={form.event_date}
                    onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                    className="admin-input"
                  />
                </FormField>
                <FormField label="End Date & Time" hint="Optional">
                  <input
                    type="datetime-local"
                    value={form.end_date ?? ""}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    className="admin-input"
                  />
                </FormField>
              </div>

              {/* Location + Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Venue / Location">
                  <input
                    type="text"
                    value={form.location ?? ""}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="admin-input"
                    placeholder="e.g. Macquarie University"
                  />
                </FormField>
                <FormField label="Street Address">
                  <input
                    type="text"
                    value={form.address ?? ""}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="admin-input"
                    placeholder="e.g. Balaclava Rd, Macquarie Park"
                  />
                </FormField>
              </div>

              {/* Image URL */}
              <FormField label="Image URL" hint="Paste a direct image link">
                <input
                  type="url"
                  value={form.image_url ?? ""}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  className="admin-input"
                  placeholder="https://…"
                />
                {imageValid && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.image_url}
                    alt="Preview"
                    className="mt-2 h-24 w-full object-cover rounded-lg border border-border"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                  />
                )}
              </FormField>

              {/* Registration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Registration URL" hint="Humanitix / Eventbrite / TryBooking">
                  <input
                    type="url"
                    value={form.registration_url ?? ""}
                    onChange={(e) => setForm({ ...form, registration_url: e.target.value })}
                    className="admin-input"
                    placeholder="https://…"
                  />
                </FormField>
                <FormField label="Button Label">
                  <input
                    type="text"
                    value={form.registration_label ?? "Register Now"}
                    onChange={(e) => setForm({ ...form, registration_label: e.target.value })}
                    className="admin-input"
                    placeholder="Register Now"
                  />
                </FormField>
              </div>

              {/* Price + Capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Price">
                  <input
                    type="text"
                    value={form.price ?? "Free"}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="admin-input"
                    placeholder="Free"
                  />
                </FormField>
                <FormField label="Capacity" hint="Leave blank if unlimited">
                  <input
                    type="number"
                    min={1}
                    value={form.capacity ?? ""}
                    onChange={(e) => setForm({ ...form, capacity: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="admin-input"
                    placeholder="e.g. 100"
                  />
                </FormField>
              </div>

              {/* Tags */}
              <FormField label="Tags" hint="Comma or pipe separated">
                <input
                  type="text"
                  value={form.tagsInput}
                  onChange={(e) => updateTagsInput(e.target.value)}
                  className="admin-input"
                  placeholder="Networking, Professional, Social"
                />
                {form.tags && form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium bg-primary/10 text-primary px-2.5 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </FormField>

              {/* Featured */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div
                  onClick={() => setForm({ ...form, is_featured: !form.is_featured })}
                  className={cn(
                    "relative w-10 h-6 rounded-full transition-colors",
                    form.is_featured ? "bg-primary" : "bg-muted/30"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform",
                      form.is_featured ? "left-5" : "left-1"
                    )}
                  />
                </div>
                <span className="text-sm text-text">Featured event</span>
              </label>

              <div className="flex gap-3 pt-3 border-t border-border">
                <Button type="submit" size="md" disabled={saving} className="flex-1">
                  {saving ? "Saving…" : editing ? "Save Changes" : "Create Event"}
                </Button>
                <Button type="button" variant="cream" size="md" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-border shadow-2xl p-8 max-w-sm w-full">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={20} className="text-red-600" />
            </div>
            <h3 className="font-display text-xl text-text text-center mb-1">Delete Event?</h3>
            <p className="text-sm text-muted text-center mb-6">
              Are you sure you want to delete <span className="font-semibold text-text">&ldquo;{deleteTarget.title}&rdquo;</span>?
              This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-full py-2.5 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => { setShowDeleteModal(false); setDeleteTarget(null) }}
                className="flex-1 bg-cream border border-border text-text text-sm font-semibold rounded-full py-2.5 hover:border-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CSV Import Modal ── */}
      {showCSVModal && (
        <CSVImportModal
          onClose={() => setShowCSVModal(false)}
          onComplete={() => { loadEvents() }}
          onError={(msg) => addToast(msg, "error")}
          supabase={supabase}
        />
      )}
    </div>
  )
}

// ─── FormField helper ─────────────────────────────────────────────────────────

function FormField({
  label, required, hint, children,
}: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted">
          {label} {required && <span className="text-primary">*</span>}
        </label>
        {hint && <span className="text-[10px] text-muted">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

// ─── CSV Import Modal ─────────────────────────────────────────────────────────

interface CSVRow {
  title: string
  description?: string
  long_description?: string
  event_date: string
  end_date?: string
  location?: string
  address?: string
  image_url?: string
  registration_url?: string
  registration_label?: string
  price?: string
  capacity?: string
  tags?: string
  is_featured?: string
  _valid: boolean
  _errors: string[]
}

function CSVImportModal({
  onClose, onComplete, onError, supabase,
}: {
  onClose: () => void
  onComplete: (count: number) => void
  onError: (msg: string) => void
  supabase: ReturnType<typeof createClient>
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [rows, setRows] = useState<CSVRow[]>([])
  const [fileName, setFileName] = useState("")
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [summary, setSummary] = useState<{ imported: number; skipped: number } | null>(null)
  const [wixInfoOpen, setWixInfoOpen] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(file: File) {
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const { rows: parsed, errors } = parseCSV(text)
      if (errors.length && !parsed.length) {
        onError("Could not parse CSV: " + errors[0])
        return
      }
      const validated: CSVRow[] = parsed.map((row) => {
        const errs: string[] = []
        if (!row.title?.trim()) errs.push("Missing title")
        if (!row.event_date?.trim()) errs.push("Missing event_date")
        else if (isNaN(Date.parse(row.event_date))) errs.push("Invalid event_date (use ISO format)")
        return {
          title: row.title ?? "",
          description: row.description,
          long_description: row.long_description,
          event_date: row.event_date ?? "",
          end_date: row.end_date,
          location: row.location,
          address: row.address,
          image_url: row.image_url,
          registration_url: row.registration_url,
          registration_label: row.registration_label,
          price: row.price,
          capacity: row.capacity,
          tags: row.tags,
          is_featured: row.is_featured,
          _valid: errs.length === 0,
          _errors: errs,
        }
      })
      setRows(validated)
      setStep(2)
    }
    reader.readAsText(file)
  }

  async function handleImport() {
    setStep(3)
    setImporting(true)
    const valid = rows.filter((r) => r._valid)
    let imported = 0
    let skipped = 0
    const BATCH = 10

    for (let i = 0; i < valid.length; i += BATCH) {
      const batch = valid.slice(i, i + BATCH)
      const payloads = batch.map((row) => ({
        title: row.title,
        slug: slugify(row.title) + "-" + Math.random().toString(36).slice(2, 6),
        description: row.description || null,
        long_description: row.long_description || null,
        event_date: row.event_date,
        end_date: row.end_date || null,
        location: row.location || null,
        address: row.address || null,
        image_url: row.image_url || null,
        registration_url: row.registration_url || null,
        registration_label: row.registration_label || "Register Now",
        price: row.price || "Free",
        capacity: row.capacity ? parseInt(row.capacity) : null,
        tags: row.tags ? parseTags(row.tags) : null,
        is_featured: row.is_featured === "true" || row.is_featured === "1",
      }))

      const { error } = await supabase.from("events").insert(payloads)
      if (error) { skipped += batch.length }
      else { imported += batch.length }

      setProgress(Math.round(((i + BATCH) / valid.length) * 100))
    }

    setImporting(false)
    setSummary({ imported, skipped: rows.filter((r) => !r._valid).length + skipped })
  }

  const validCount = rows.filter((r) => r._valid).length
  const invalidCount = rows.filter((r) => !r._valid).length

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-border shadow-2xl w-full max-w-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h2 className="font-display text-xl text-text">Import Events from CSV</h2>
            <div className="flex items-center gap-2 mt-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-1.5">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold",
                      step >= s ? "bg-primary text-white" : "bg-cream border border-border text-muted"
                    )}
                  >
                    {s}
                  </div>
                  {s < 3 && <div className={cn("w-8 h-0.5", step > s ? "bg-primary" : "bg-border")} />}
                </div>
              ))}
              <span className="text-xs text-muted ml-1">
                {step === 1 ? "Upload" : step === 2 ? "Preview" : "Import"}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted hover:text-text hover:bg-cream rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {/* Step 1 — Upload */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Wix info */}
              <div className="bg-cream rounded-xl border border-border overflow-hidden">
                <button
                  onClick={() => setWixInfoOpen(!wixInfoOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-text"
                >
                  How to export from Wix
                  {wixInfoOpen ? <ChevronUp size={15} className="text-muted" /> : <ChevronDown size={15} className="text-muted" />}
                </button>
                {wixInfoOpen && (
                  <div className="px-4 pb-4 text-sm text-muted space-y-1">
                    <p>1. Go to your Wix dashboard → <strong>Events</strong></p>
                    <p>2. Click the <strong>···</strong> menu → <strong>Export Events</strong></p>
                    <p>3. Download the CSV file — you may need to remap column names to match the template below.</p>
                  </div>
                )}
              </div>

              {/* Drop zone */}
              <div
                className="border-2 border-dashed border-border rounded-xl p-10 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  const file = e.dataTransfer.files[0]
                  if (file) handleFile(file)
                }}
                onClick={() => fileRef.current?.click()}
              >
                <Upload size={28} className="text-muted mx-auto mb-3" />
                <p className="font-medium text-text text-sm mb-1">
                  Drop your CSV file here, or click to browse
                </p>
                <p className="text-xs text-muted">Only .csv files are supported</p>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv"
                  className="sr-only"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
                />
              </div>

              {/* Guidance */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-1.5 text-xs text-muted">
                <p className="font-semibold text-text mb-2 text-sm">Format guidance</p>
                <p>• <strong>event_date</strong> — use ISO format: <code className="bg-white px-1 py-0.5 rounded text-[11px]">2025-09-27T19:00:00</code></p>
                <p>• <strong>tags</strong> — separate multiple tags with a pipe <code className="bg-white px-1 py-0.5 rounded text-[11px]">|</code> character</p>
                <p>• <strong>is_featured</strong> — use <code className="bg-white px-1 py-0.5 rounded text-[11px]">true</code> or <code className="bg-white px-1 py-0.5 rounded text-[11px]">false</code></p>
              </div>

              <button
                onClick={() => downloadCSV(generateCSVTemplate(), "assoc-events-template.csv")}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <Download size={14} /> Download CSV template
              </button>
            </div>
          )}

          {/* Step 2 — Preview */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-text">
                  <span className="font-semibold">{fileName}</span>
                  {" — "}
                  <span className="text-emerald-600 font-semibold">{validCount} rows ready</span>
                  {invalidCount > 0 && (
                    <span className="text-red-500 font-semibold">, {invalidCount} with errors (will be skipped)</span>
                  )}
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-xs min-w-140">
                  <thead>
                    <tr className="bg-cream border-b border-border">
                      <th className="text-left px-3 py-2.5 font-semibold text-muted uppercase tracking-wider">Status</th>
                      <th className="text-left px-3 py-2.5 font-semibold text-muted uppercase tracking-wider">Title</th>
                      <th className="text-left px-3 py-2.5 font-semibold text-muted uppercase tracking-wider">Date</th>
                      <th className="text-left px-3 py-2.5 font-semibold text-muted uppercase tracking-wider">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 5).map((row, i) => (
                      <tr
                        key={i}
                        className={cn(
                          "border-b border-border last:border-0",
                          !row._valid && "bg-red-50"
                        )}
                      >
                        <td className="px-3 py-2.5">
                          {row._valid ? (
                            <span className="text-emerald-600 font-semibold">✓</span>
                          ) : (
                            <span title={row._errors.join(", ")} className="text-red-500 font-semibold flex items-center gap-1">
                              <AlertCircle size={12} /> Error
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2.5 font-medium text-text max-w-45 truncate">{row.title || "—"}</td>
                        <td className="px-3 py-2.5 text-muted">{row.event_date || "—"}</td>
                        <td className="px-3 py-2.5 text-muted">{row.location || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {rows.length > 5 && (
                  <p className="text-xs text-muted text-center py-2 border-t border-border">
                    …and {rows.length - 5} more rows
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  size="md"
                  disabled={validCount === 0}
                  onClick={handleImport}
                  className="flex-1"
                >
                  Import {validCount} Event{validCount !== 1 ? "s" : ""}
                </Button>
                <Button type="button" variant="cream" size="md" onClick={() => setStep(1)}>
                  Back
                </Button>
              </div>
            </div>
          )}

          {/* Step 3 — Progress / Complete */}
          {step === 3 && (
            <div className="text-center py-6 space-y-6">
              {importing ? (
                <>
                  <p className="font-display text-xl text-text">Importing events…</p>
                  <div className="w-full bg-cream rounded-full h-3 overflow-hidden border border-border">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted">{Math.min(progress, 100)}% complete</p>
                </>
              ) : summary && (
                <>
                  <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                    <span className="text-emerald-600 text-2xl">✓</span>
                  </div>
                  <p className="font-display text-2xl text-text">Import Complete</p>
                  <div className="bg-cream rounded-xl border border-border p-4 text-sm space-y-1">
                    <p><span className="font-semibold text-emerald-600">{summary.imported}</span> events imported</p>
                    {summary.skipped > 0 && (
                      <p><span className="font-semibold text-red-500">{summary.skipped}</span> events skipped (errors or invalid)</p>
                    )}
                  </div>
                  <Button
                    onClick={() => { onComplete(summary.imported); onClose() }}
                    size="md"
                  >
                    Done
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
