import { createClient } from "@/lib/supabase/server";
import { Calendar, BookOpen, Users, TrendingUp } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard | ASSOC" };

async function getStats() {
  try {
    const supabase = await createClient();
    const [events, guides] = await Promise.all([
      supabase.from("events").select("id, title, event_date, is_featured").order("event_date", { ascending: false }).limit(5),
      supabase.from("guides").select("id, title, unit_code, published").order("created_at", { ascending: false }).limit(5),
    ]);
    return {
      events: events.data ?? [],
      guides: guides.data ?? [],
    };
  } catch {
    return { events: [], guides: [] };
  }
}

export default async function DashboardPage() {
  const { events, guides } = await getStats();

  const stats = [
    { icon: Calendar, label: "Total Events", value: events.length, color: "bg-blue-50 text-blue-600" },
    { icon: BookOpen, label: "Published Guides", value: guides.filter((g) => g.published).length, color: "bg-emerald-50 text-emerald-600" },
    { icon: Users, label: "Cabinet Members", value: "—", color: "bg-purple-50 text-purple-600" },
    { icon: TrendingUp, label: "Active Sponsors", value: "—", color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-text">Dashboard</h1>
        <p className="text-muted mt-1">Welcome back. Here&apos;s an overview of ASSOC.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon size={18} />
            </div>
            <p className="font-display text-3xl text-text">{stat.value}</p>
            <p className="text-xs text-muted mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl text-text">Recent Events</h2>
            <a href="/admin/dashboard/events" className="text-xs text-primary hover:underline">
              Manage →
            </a>
          </div>
          {events.length === 0 ? (
            <p className="text-sm text-muted">No events yet.</p>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="flex items-center justify-between gap-4 py-2.5 border-b border-border last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text truncate">{event.title}</p>
                    <p className="text-xs text-muted">
                      {new Date(event.event_date).toLocaleDateString("en-AU")}
                    </p>
                  </div>
                  {event.is_featured && (
                    <span className="text-xs bg-primary/10 text-primary rounded-full px-2.5 py-0.5 shrink-0">
                      Featured
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent guides */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl text-text">Recent Guides</h2>
            <a href="/admin/dashboard/guides" className="text-xs text-primary hover:underline">
              Manage →
            </a>
          </div>
          {guides.length === 0 ? (
            <p className="text-sm text-muted">No guides yet.</p>
          ) : (
            <div className="space-y-3">
              {guides.map((guide) => (
                <div key={guide.id} className="flex items-center justify-between gap-4 py-2.5 border-b border-border last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text truncate">{guide.title}</p>
                    <p className="text-xs text-muted font-mono">{guide.unit_code}</p>
                  </div>
                  <span className={`text-xs rounded-full px-2.5 py-0.5 shrink-0 ${guide.published ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {guide.published ? "Published" : "Draft"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
