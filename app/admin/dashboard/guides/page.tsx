/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  BookOpen,
  Copy,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { slugify, parseTags } from "@/lib/utils";
import { useToast, ToastContainer } from "@/components/ui/Toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import type { Guide, GuideSection } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

type SectionDraft = Omit<GuideSection, "guide_id"> & { _tempId: string };

type FormData = {
  title: string;
  slug: string;
  unit_code: string;
  unit_name: string;
  author: string;
  cover_image_url: string;
  difficulty: "easy" | "medium" | "hard";
  year_level: number;
  read_time_minutes: string;
  tagsInput: string;
  tags: string[];
  published: boolean;
  intro: string;
  final_notes: string;
};

type GuideRow = Guide & { section_count?: number };

const EMPTY_FORM: FormData = {
  title: "",
  slug: "",
  unit_code: "",
  unit_name: "",
  author: "",
  cover_image_url: "",
  difficulty: "easy",
  year_level: 1,
  read_time_minutes: "",
  tagsInput: "",
  tags: [],
  published: false,
  intro: "",
  final_notes: "",
};

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminGuidesPage() {
  const [guides, setGuides] = useState<GuideRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Guide | null>(null);
  const [editing, setEditing] = useState<Guide | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [sections, setSections] = useState<SectionDraft[]>([]);
  const [saving, setSaving] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  const supabase = createClient();

  // ── Data loading ────────────────────────────────────────────────────────────

  const loadGuides = useCallback(async () => {
    setLoading(true);
    const { data: guidesData, error } = await supabase
      .from("guides")
      .select("*")
      .order("unit_code");
    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const guideIds = (guidesData ?? []).map((g) => g.id);
    const sectionCounts: Record<string, number> = {};

    if (guideIds.length) {
      const { data: secData } = await supabase
        .from("guide_sections")
        .select("guide_id")
        .in("guide_id", guideIds);

      (secData ?? []).forEach((s) => {
        sectionCounts[s.guide_id] = (sectionCounts[s.guide_id] ?? 0) + 1;
      });
    }

    setGuides(
      (guidesData ?? []).map((g) => ({
        ...g,
        section_count: sectionCounts[g.id] ?? 0,
      })),
    );
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadGuides();
  }, [loadGuides]);

  const total = guides.length;
  const published = guides.filter((g) => g.published).length;
  const drafts = total - published;
  const filtered = guides.filter(
    (g) =>
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.unit_code.toLowerCase().includes(search.toLowerCase()),
  );

  // ── Sheet helpers ───────────────────────────────────────────────────────────

  function makeTempId() {
    return Math.random().toString(36).slice(2);
  }

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setSections([]);
    setSlugManuallyEdited(false);
    setSheetOpen(true);
  }

  async function openEdit(guide: Guide) {
    setEditing(guide);
    setForm({
      title: guide.title,
      slug: guide.slug ?? "",
      unit_code: guide.unit_code,
      unit_name: guide.unit_name,
      author: guide.author ?? "",
      cover_image_url: guide.cover_image_url ?? "",
      difficulty: guide.difficulty ?? "easy",
      year_level: guide.year_level ?? 1,
      read_time_minutes: guide.read_time_minutes?.toString() ?? "",
      tagsInput: (guide.tags ?? []).join(", "),
      tags: guide.tags ?? [],
      published: guide.published,
      intro: guide.intro ?? "",
      final_notes: guide.final_notes ?? "",
    });
    setSlugManuallyEdited(true);

    const { data } = await supabase
      .from("guide_sections")
      .select("*")
      .eq("guide_id", guide.id)
      .order("display_order");
    setSections((data ?? []).map((s) => ({ ...s, _tempId: s.id })));
    setSheetOpen(true);
  }

  async function openDuplicate(guide: Guide) {
    setEditing(null);
    setForm({
      title: guide.title,
      slug:
        (guide.slug ?? slugify(guide.unit_code + " " + guide.title)) + "-copy",
      unit_code: guide.unit_code,
      unit_name: guide.unit_name,
      author: guide.author ?? "",
      cover_image_url: guide.cover_image_url ?? "",
      difficulty: guide.difficulty ?? "easy",
      year_level: guide.year_level ?? 1,
      read_time_minutes: guide.read_time_minutes?.toString() ?? "",
      tagsInput: (guide.tags ?? []).join(", "),
      tags: guide.tags ?? [],
      published: false,
      intro: guide.intro ?? "",
      final_notes: guide.final_notes ?? "",
    });
    setSlugManuallyEdited(true);

    const { data } = await supabase
      .from("guide_sections")
      .select("*")
      .eq("guide_id", guide.id)
      .order("display_order");
    setSections(
      (data ?? []).map((s) => ({
        ...s,
        id: makeTempId(),
        _tempId: makeTempId(),
      })),
    );
    setSheetOpen(true);
  }

  function updateUnitOrTitle(field: "unit_code" | "title", value: string) {
    const nextForm = {
      ...form,
      [field]: field === "unit_code" ? value.toUpperCase() : value,
    };
    if (!slugManuallyEdited) {
      nextForm.slug = slugify(
        (field === "unit_code" ? value : form.unit_code) +
          " " +
          (field === "title" ? value : form.title),
      );
    }
    setForm(nextForm);
  }

  function updateTagsInput(value: string) {
    setForm((prev) => ({ ...prev, tagsInput: value, tags: parseTags(value) }));
  }

  // ── Section management ──────────────────────────────────────────────────────

  function addSection() {
    setSections((prev) => [
      ...prev,
      {
        id: makeTempId(),
        _tempId: makeTempId(),
        guide_id: "",
        question: "",
        answer: "",
        display_order: prev.length,
      },
    ]);
  }

  function updateSection(
    tempId: string,
    field: "question" | "answer",
    value: string,
  ) {
    setSections((prev) =>
      prev.map((s) => (s._tempId === tempId ? { ...s, [field]: value } : s)),
    );
  }

  function deleteSection(tempId: string) {
    setSections((prev) =>
      prev
        .filter((s) => s._tempId !== tempId)
        .map((s, i) => ({ ...s, display_order: i })),
    );
  }

  function moveSection(tempId: string, dir: -1 | 1) {
    setSections((prev) => {
      const idx = prev.findIndex((s) => s._tempId === tempId);
      const next = idx + dir;
      if (next < 0 || next >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return arr.map((s, i) => ({ ...s, display_order: i }));
    });
  }

  // ── Save ────────────────────────────────────────────────────────────────────

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.unit_code || !form.title || !form.slug) {
      addToast("Unit Code, Title, and Slug are required.", "error");
      return;
    }
    setSaving(true);

    const payload = {
      title: form.title,
      slug: form.slug,
      unit_code: form.unit_code,
      unit_name: form.unit_name,
      author: form.author || null,
      cover_image_url: form.cover_image_url || null,
      difficulty: form.difficulty,
      year_level: form.year_level,
      read_time_minutes: form.read_time_minutes
        ? parseInt(form.read_time_minutes)
        : null,
      tags: form.tags.length ? form.tags : null,
      published: form.published,
      intro: form.intro || null,
      final_notes: form.final_notes || null,
    };

    let guideId: string;

    if (editing) {
      const { error } = await supabase
        .from("guides")
        .update(payload)
        .eq("id", editing.id);
      if (error) {
        addToast("Failed to update guide.", "error");
        setSaving(false);
        return;
      }
      guideId = editing.id;
    } else {
      const { data, error } = await supabase
        .from("guides")
        .insert([payload])
        .select("id")
        .single();
      if (error || !data) {
        addToast("Failed to create guide.", "error");
        setSaving(false);
        return;
      }
      guideId = data.id;
    }

    // Delete existing sections then re-insert
    await supabase.from("guide_sections").delete().eq("guide_id", guideId);

    if (sections.length) {
      const sectionPayloads = sections.map((s, i) => ({
        guide_id: guideId,
        question: s.question,
        answer: s.answer,
        display_order: i,
      }));
      const { error } = await supabase
        .from("guide_sections")
        .insert(sectionPayloads);
      if (error) {
        addToast("Guide saved but sections failed to save.", "error");
      }
    }

    addToast(editing ? "Guide updated." : "Guide created.");
    setSaving(false);
    setSheetOpen(false);
    loadGuides();
  }

  // ── Toggle published ────────────────────────────────────────────────────────

  async function handleTogglePublished(guide: Guide) {
    const { error } = await supabase
      .from("guides")
      .update({ published: !guide.published })
      .eq("id", guide.id);
    if (error) {
      addToast("Failed to update status.", "error");
      return;
    }
    setGuides((prev) =>
      prev.map((g) =>
        g.id === guide.id ? { ...g, published: !g.published } : g,
      ),
    );
  }

  // ── Delete ──────────────────────────────────────────────────────────────────

  async function handleDelete() {
    if (!deleteTarget) return;
    const { error } = await supabase
      .from("guides")
      .delete()
      .eq("id", deleteTarget.id);
    if (error) {
      addToast("Failed to delete guide.", "error");
    } else {
      addToast(`"${deleteTarget.title}" deleted.`);
    }
    setDeleteTarget(null);
    loadGuides();
  }

  const diffBadge = (d?: string) => {
    if (d === "easy") return "bg-emerald-100 text-emerald-700";
    if (d === "medium") return "bg-amber-100 text-amber-700";
    if (d === "hard") return "bg-rose-100 text-rose-700";
    return "bg-gray-100 text-gray-600";
  };

  const imageValid =
    form.cover_image_url?.startsWith("http") &&
    /\.(jpg|jpeg|png|gif|webp|svg|avif)(\?.*)?$/i.test(form.cover_image_url);

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 lg:p-8">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl text-text">Manage Guides</h1>
          <p className="text-muted mt-1 text-sm">
            Add, edit, and organise unit survival guides.
          </p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus size={14} /> Add Guide
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total", value: total, color: "text-primary" },
          { label: "Published", value: published, color: "text-emerald-600" },
          { label: "Drafts", value: drafts, color: "text-amber-600" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-border p-4 shadow-sm text-center"
          >
            <p className={cn("font-display text-3xl", s.color)}>{s.value}</p>
            <p className="text-xs text-muted mt-0.5 font-medium uppercase tracking-wider">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search by title or unit code…"
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
            <BookOpen size={32} className="text-muted mx-auto mb-3" />
            <p className="font-display text-xl text-text mb-1">
              {search ? "No matching guides" : "No guides yet"}
            </p>
            <p className="text-sm text-muted">
              {search
                ? "Try a different search term."
                : "Add your first guide to get started."}
            </p>
          </div>
        ) : (
          <table className="w-full min-w-175">
            <thead>
              <tr className="border-b border-border bg-cream">
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted">
                  Unit
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted hidden md:table-cell">
                  Author
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted">
                  Difficulty
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted hidden sm:table-cell">
                  Year
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted hidden lg:table-cell">
                  Sections
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted">
                  Published
                </th>
                <th className="px-5 py-3.5 w-28" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((guide) => (
                <tr
                  key={guide.id}
                  className="border-b border-border last:border-0 hover:bg-cream/30 transition-colors"
                >
                  <td className="px-5 py-4">
                    <p className="text-xs font-bold font-mono text-primary">
                      {guide.unit_code}
                    </p>
                    <p className="text-sm font-medium text-text">
                      {guide.title}
                    </p>
                    <p className="text-xs text-muted">{guide.unit_name}</p>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <p className="text-sm text-muted">{guide.author ?? "—"}</p>
                  </td>
                  <td className="px-5 py-4">
                    {guide.difficulty ? (
                      <span
                        className={cn(
                          "text-xs rounded-full px-2.5 py-0.5 font-medium capitalize",
                          diffBadge(guide.difficulty),
                        )}
                      >
                        {guide.difficulty}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <p className="text-sm text-muted">
                      {guide.year_level ?? "—"}
                    </p>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <p className="text-sm text-muted">
                      {guide.section_count ?? 0} sections
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleTogglePublished(guide)}
                      className={cn(
                        "relative w-10 h-6 rounded-full transition-colors shrink-0",
                        guide.published ? "bg-primary" : "bg-muted/30",
                      )}
                      aria-label={guide.published ? "Unpublish" : "Publish"}
                    >
                      <span
                        className={cn(
                          "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform",
                          guide.published ? "left-5" : "left-1",
                        )}
                      />
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => openEdit(guide)}
                        title="Edit"
                        className="p-1.5 text-muted hover:text-primary hover:bg-primary/8 rounded-lg transition-colors"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => openDuplicate(guide)}
                        title="Duplicate"
                        className="p-1.5 text-muted hover:text-primary hover:bg-primary/8 rounded-lg transition-colors"
                      >
                        <Copy size={13} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(guide)}
                        title="Delete"
                        className="p-1.5 text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Add / Edit Sheet ── */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-2xl flex flex-col p-0"
        >
          <SheetHeader>
            <SheetTitle>{editing ? "Edit Guide" : "Add Guide"}</SheetTitle>
            <SheetClose asChild>
              <button className="p-1.5 text-muted hover:text-text hover:bg-cream rounded-lg transition-colors">
                <X size={18} />
              </button>
            </SheetClose>
          </SheetHeader>

          <form
            id="guide-form"
            onSubmit={handleSave}
            className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
          >
            {/* ── Part A: Metadata ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Unit Code" required>
                <input
                  type="text"
                  required
                  value={form.unit_code}
                  onChange={(e) =>
                    updateUnitOrTitle("unit_code", e.target.value)
                  }
                  className="admin-input font-mono"
                  placeholder="ACST1052"
                />
              </FormField>
              <FormField label="Year Level">
                <select
                  value={form.year_level}
                  onChange={(e) =>
                    setForm({ ...form, year_level: Number(e.target.value) })
                  }
                  className="admin-input"
                >
                  {[1, 2, 3, 4].map((y) => (
                    <option key={y} value={y}>
                      Year {y}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <FormField label="Unit Name" required>
              <input
                type="text"
                required
                value={form.unit_name}
                onChange={(e) =>
                  setForm({ ...form, unit_name: e.target.value })
                }
                className="admin-input"
                placeholder="Introduction to Actuarial Studies"
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Guide Title" required>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => updateUnitOrTitle("title", e.target.value)}
                  className="admin-input"
                  placeholder="Guide to ACST1052"
                />
              </FormField>
              <FormField label="Slug" required hint="Auto-generated">
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => {
                    setSlugManuallyEdited(true);
                    setForm({ ...form, slug: slugify(e.target.value) });
                  }}
                  className="admin-input font-mono text-xs"
                  placeholder="acst1052-guide"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Author">
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className="admin-input"
                  placeholder="Author name"
                />
              </FormField>
              <FormField label="Difficulty">
                <select
                  value={form.difficulty}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      difficulty: e.target.value as "easy" | "medium" | "hard",
                    })
                  }
                  className="admin-input"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Read Time (minutes)">
                <input
                  type="number"
                  min={1}
                  value={form.read_time_minutes}
                  onChange={(e) =>
                    setForm({ ...form, read_time_minutes: e.target.value })
                  }
                  className="admin-input"
                  placeholder="e.g. 8"
                />
              </FormField>
              <FormField label="Tags" hint="Comma separated">
                <input
                  type="text"
                  value={form.tagsInput}
                  onChange={(e) => updateTagsInput(e.target.value)}
                  className="admin-input"
                  placeholder="first year, R, Excel"
                />
              </FormField>
            </div>

            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
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

            <FormField label="Cover Image URL" hint="Paste a direct image link">
              <input
                type="url"
                value={form.cover_image_url}
                onChange={(e) =>
                  setForm({ ...form, cover_image_url: e.target.value })
                }
                className="admin-input"
                placeholder="https://…"
              />
              {imageValid && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.cover_image_url}
                  alt="Preview"
                  className="mt-2 h-24 w-full object-cover rounded-lg border border-border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
            </FormField>

            {/* Published toggle */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div
                onClick={() => setForm({ ...form, published: !form.published })}
                className={cn(
                  "relative w-10 h-6 rounded-full transition-colors",
                  form.published ? "bg-primary" : "bg-muted/30",
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform",
                    form.published ? "left-5" : "left-1",
                  )}
                />
              </div>
              <span className="text-sm text-text">
                Published (visible to students)
              </span>
            </label>

            {/* ── Divider ── */}
            <div className="relative flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted shrink-0">
                Content
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* ── Part B: Content ── */}
            <FormField
              label="Opening Introduction"
              hint="Reflective opening paragraph"
            >
              <textarea
                rows={4}
                value={form.intro}
                onChange={(e) => setForm({ ...form, intro: e.target.value })}
                className="admin-input resize-none"
                placeholder="Reflecting upon my first semester…"
              />
            </FormField>

            {/* Q&A Sections */}
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Q&amp;A Sections
                </label>
                <span className="text-[10px] text-muted">
                  {sections.length} section{sections.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="space-y-3">
                {sections.map((section, i) => (
                  <div
                    key={section._tempId}
                    className="bg-cream rounded-xl border border-border p-4 space-y-3"
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical
                        size={14}
                        className="text-muted mt-2.5 shrink-0"
                      />
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={section.question}
                          onChange={(e) =>
                            updateSection(
                              section._tempId,
                              "question",
                              e.target.value,
                            )
                          }
                          className="admin-input text-sm"
                          placeholder="Question, e.g. What is the most challenging part?"
                        />
                        <textarea
                          rows={3}
                          value={section.answer}
                          onChange={(e) =>
                            updateSection(
                              section._tempId,
                              "answer",
                              e.target.value,
                            )
                          }
                          className="admin-input resize-none text-sm"
                          placeholder="Answer…"
                        />
                      </div>
                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => moveSection(section._tempId, -1)}
                          disabled={i === 0}
                          className="p-1 text-muted hover:text-text disabled:opacity-30 rounded transition-colors"
                        >
                          <ChevronUp size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveSection(section._tempId, 1)}
                          disabled={i === sections.length - 1}
                          className="p-1 text-muted hover:text-text disabled:opacity-30 rounded transition-colors"
                        >
                          <ChevronDown size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteSection(section._tempId)}
                          className="p-1 text-muted hover:text-red-500 rounded transition-colors"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addSection}
                className="mt-3 w-full border border-dashed border-border rounded-xl py-2.5 text-sm text-muted hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={14} /> Add Question
              </button>
            </div>

            <FormField label="Final Notes" hint="Optional warm closing message">
              <textarea
                rows={3}
                value={form.final_notes}
                onChange={(e) =>
                  setForm({ ...form, final_notes: e.target.value })
                }
                className="admin-input resize-none"
                placeholder="I wish you the best of luck with your exams!"
              />
            </FormField>
          </form>

          <SheetFooter>
            <SheetClose asChild>
              <Button type="button" variant="cream" size="md">
                Cancel
              </Button>
            </SheetClose>
            <Button type="submit" form="guide-form" size="md" disabled={saving}>
              {saving ? "Saving…" : editing ? "Save Changes" : "Create Guide"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* ── Delete confirm ── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-border shadow-2xl p-8 max-w-sm w-full">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={20} className="text-red-600" />
            </div>
            <h3 className="font-display text-xl text-text text-center mb-1">
              Delete Guide?
            </h3>
            <p className="text-sm text-muted text-center mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-text">
                &ldquo;{deleteTarget.title}&rdquo;
              </span>
              ? All Q&amp;A sections will also be deleted. This cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-full py-2.5 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 bg-cream border border-border text-text text-sm font-semibold rounded-full py-2.5 hover:border-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── FormField helper ─────────────────────────────────────────────────────────

function FormField({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
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
  );
}
