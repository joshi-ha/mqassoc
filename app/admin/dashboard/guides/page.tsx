"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Pencil, Trash2, X, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { Guide } from "@/types";

const EMPTY_FORM: Omit<Guide, "id" | "created_at"> = {
  title: "",
  unit_code: "",
  unit_name: "",
  content: "",
  author: "",
  difficulty: "easy",
  year_level: 1,
  tags: [],
  published: false,
};

export default function AdminGuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Guide | null>(null);
  const [form, setForm] = useState<Omit<Guide, "id" | "created_at">>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const supabase = createClient();

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadGuides = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("guides")
      .select("*")
      .order("unit_code");
    if (error) console.error("Load guides error:", error);
    setGuides(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { loadGuides(); }, [loadGuides]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setTagsInput("");
    setShowModal(true);
  };

  const openEdit = (guide: Guide) => {
    setEditing(guide);
    setForm({
      title: guide.title,
      unit_code: guide.unit_code,
      unit_name: guide.unit_name,
      content: guide.content ?? "",
      author: guide.author ?? "",
      difficulty: guide.difficulty ?? "easy",
      year_level: guide.year_level ?? 1,
      tags: guide.tags ?? [],
      published: guide.published,
    });
    setTagsInput((guide.tags ?? []).join(", "));
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const data = {
      ...form,
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
    };
    if (editing) {
      const { error } = await supabase.from("guides").update(data).eq("id", editing.id);
      if (error) { showToast("Failed to update guide.", "error"); }
      else { showToast("Guide updated."); }
    } else {
      const { error } = await supabase.from("guides").insert([data]);
      if (error) { showToast("Failed to create guide.", "error"); }
      else { showToast("Guide created."); }
    }
    setSaving(false);
    setShowModal(false);
    loadGuides();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("guides").delete().eq("id", id);
    if (error) { showToast("Failed to delete guide.", "error"); }
    else { showToast("Guide deleted."); }
    setDeleteId(null);
    loadGuides();
  };

  const diffBadge = (d?: string) => {
    if (d === "easy") return "bg-emerald-100 text-emerald-700";
    if (d === "medium") return "bg-amber-100 text-amber-700";
    if (d === "hard") return "bg-rose-100 text-rose-700";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="p-8">
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
          <h1 className="font-display text-3xl text-text">Unit Guides</h1>
          <p className="text-muted mt-1">Manage unit survival guides</p>
        </div>
        <Button onClick={openCreate} size="md">
          <Plus size={16} /> Add Guide
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-10 text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : guides.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen size={32} className="text-muted mx-auto mb-3" />
            <p className="font-display text-xl text-text mb-1">No guides yet</p>
            <p className="text-sm text-muted">Add your first unit guide to get started.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-cream">
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Unit</th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted hidden md:table-cell">Author</th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Difficulty</th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Status</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {guides.map((guide) => (
                <tr key={guide.id} className="border-b border-border last:border-0 hover:bg-cream/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-primary font-mono">{guide.unit_code}</p>
                    <p className="text-sm font-medium text-text">{guide.title}</p>
                    <p className="text-xs text-muted">{guide.unit_name}</p>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <p className="text-sm text-muted">{guide.author ?? "—"}</p>
                  </td>
                  <td className="px-6 py-4">
                    {guide.difficulty ? (
                      <span className={`text-xs rounded-full px-2.5 py-1 font-medium ${diffBadge(guide.difficulty)}`}>
                        {guide.difficulty}
                      </span>
                    ) : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs rounded-full px-2.5 py-1 font-medium ${guide.published ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                      {guide.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => openEdit(guide)}
                        className="p-1.5 text-muted hover:text-primary hover:bg-primary/8 rounded-lg transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(guide.id)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-border shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h2 className="font-display text-xl text-text">
                {editing ? "Edit Guide" : "Add Guide"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-muted hover:text-text hover:bg-cream rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Unit Code" required>
                  <input
                    type="text"
                    required
                    value={form.unit_code}
                    onChange={(e) => setForm({ ...form, unit_code: e.target.value.toUpperCase() })}
                    className="admin-input"
                    placeholder="ACST101"
                  />
                </FormField>
                <FormField label="Year Level">
                  <select
                    value={form.year_level ?? 1}
                    onChange={(e) => setForm({ ...form, year_level: Number(e.target.value) })}
                    className="admin-input"
                  >
                    {[1, 2, 3, 4].map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </FormField>
              </div>
              <FormField label="Unit Name" required>
                <input
                  type="text"
                  required
                  value={form.unit_name}
                  onChange={(e) => setForm({ ...form, unit_name: e.target.value })}
                  className="admin-input"
                  placeholder="Introduction to Probability"
                />
              </FormField>
              <FormField label="Guide Title" required>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="admin-input"
                  placeholder="Survival Guide to ACST101"
                />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Author">
                  <input
                    type="text"
                    value={form.author ?? ""}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="admin-input"
                    placeholder="Author name"
                  />
                </FormField>
                <FormField label="Difficulty">
                  <select
                    value={form.difficulty ?? "easy"}
                    onChange={(e) => setForm({ ...form, difficulty: e.target.value as Guide["difficulty"] })}
                    className="admin-input"
                  >
                    <option value="easy">Easy (1st Year)</option>
                    <option value="medium">Medium (2nd–3rd Year)</option>
                    <option value="hard">Hard (Advanced)</option>
                  </select>
                </FormField>
              </div>
              <FormField label="Tags (comma-separated)">
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="admin-input"
                  placeholder="probability, statistics, exam tips"
                />
              </FormField>
              <FormField label="Content (Markdown supported)">
                <textarea
                  rows={8}
                  value={form.content ?? ""}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="admin-input resize-none font-mono text-xs"
                  placeholder="## Overview&#10;&#10;Write your guide content here..."
                />
              </FormField>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  className="w-4 h-4 rounded border-border accent-primary"
                />
                <span className="text-sm text-text">Published (visible to students)</span>
              </label>
              <div className="flex gap-3 pt-2">
                <Button type="submit" size="md" disabled={saving} className="flex-1">
                  {saving ? "Saving…" : editing ? "Save Changes" : "Create Guide"}
                </Button>
                <Button type="button" variant="cream" size="md" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-border shadow-2xl p-8 max-w-sm w-full text-center">
            <h3 className="font-display text-xl text-text mb-2">Delete Guide?</h3>
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
