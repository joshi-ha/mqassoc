"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Pencil, Trash2, X, Calendar, MapPin, Link as LinkIcon, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { Event } from "@/types";

const EMPTY_FORM: Omit<Event, "id" | "created_at"> = {
  title: "",
  description: "",
  event_date: "",
  location: "",
  image_url: "",
  registration_link: "",
  is_featured: false,
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [form, setForm] = useState<Omit<Event, "id" | "created_at">>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const supabase = createClient();

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadEvents = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: false });
    if (error) console.error("Load events error:", error);
    setEvents(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (event: Event) => {
    setEditing(event);
    setForm({
      title: event.title,
      description: event.description ?? "",
      event_date: event.event_date.slice(0, 16),
      location: event.location ?? "",
      image_url: event.image_url ?? "",
      registration_link: event.registration_link ?? "",
      is_featured: event.is_featured,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (editing) {
      const { error } = await supabase.from("events").update(form).eq("id", editing.id);
      if (error) { showToast("Failed to update event.", "error"); }
      else { showToast("Event updated."); }
    } else {
      const { error } = await supabase.from("events").insert([form]);
      if (error) { showToast("Failed to create event.", "error"); }
      else { showToast("Event created."); }
    }
    setSaving(false);
    setShowModal(false);
    loadEvents();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) { showToast("Failed to delete event.", "error"); }
    else { showToast("Event deleted."); }
    setDeleteId(null);
    loadEvents();
  };

  return (
    <div className="p-8">
      {/* Toast */}
      {toast && (
        <div className={cn(
          "fixed top-4 right-4 z-50 rounded-xl px-5 py-3.5 text-sm font-medium shadow-lg",
          toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
        )}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-text">Events</h1>
          <p className="text-muted mt-1">Manage ASSOC events</p>
        </div>
        <Button onClick={openCreate} size="md">
          <Plus size={16} /> Add Event
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-10 text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar size={32} className="text-muted mx-auto mb-3" />
            <p className="font-display text-xl text-text mb-1">No events yet</p>
            <p className="text-sm text-muted">Add your first event to get started.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-cream">
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Title</th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted hidden md:table-cell">Date</th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted hidden lg:table-cell">Location</th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Featured</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-b border-border last:border-0 hover:bg-cream/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-text">{event.title}</p>
                    {event.description && (
                      <p className="text-xs text-muted mt-0.5 line-clamp-1">{event.description}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <p className="text-sm text-muted">
                      {new Date(event.event_date).toLocaleDateString("en-AU")}
                    </p>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <p className="text-sm text-muted">{event.location ?? "—"}</p>
                  </td>
                  <td className="px-6 py-4">
                    {event.is_featured ? (
                      <Star size={14} className="text-amber-500 fill-amber-500" />
                    ) : (
                      <span className="text-muted text-xs">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => openEdit(event)}
                        className="p-1.5 text-muted hover:text-primary hover:bg-primary/8 rounded-lg transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(event.id)}
                        className="p-1.5 text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-border shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
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
              <FormField label="Title" required>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="admin-input"
                  placeholder="Event title"
                />
              </FormField>
              <FormField label="Date & Time" required>
                <input
                  type="datetime-local"
                  required
                  value={form.event_date}
                  onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                  className="admin-input"
                />
              </FormField>
              <FormField label="Location">
                <input
                  type="text"
                  value={form.location ?? ""}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="admin-input"
                  placeholder="Venue or online"
                />
              </FormField>
              <FormField label="Description">
                <textarea
                  rows={3}
                  value={form.description ?? ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="admin-input resize-none"
                  placeholder="Event description..."
                />
              </FormField>
              <FormField label="Registration Link">
                <input
                  type="url"
                  value={form.registration_link ?? ""}
                  onChange={(e) => setForm({ ...form, registration_link: e.target.value })}
                  className="admin-input"
                  placeholder="https://..."
                />
              </FormField>
              <FormField label="Image URL">
                <input
                  type="url"
                  value={form.image_url ?? ""}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  className="admin-input"
                  placeholder="https://..."
                />
              </FormField>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                  className="w-4 h-4 rounded border-border accent-primary"
                />
                <span className="text-sm text-text">Featured event</span>
              </label>
              <div className="flex gap-3 pt-2">
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

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-border shadow-2xl p-8 max-w-sm w-full text-center">
            <h3 className="font-display text-xl text-text mb-2">Delete Event?</h3>
            <p className="text-sm text-muted mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <Button size="md" className="bg-red-600 hover:bg-red-700" onClick={() => handleDelete(deleteId)}>
                Delete
              </Button>
              <Button variant="cream" size="md" onClick={() => setDeleteId(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      {children}
    </div>
  );
}
