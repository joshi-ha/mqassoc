"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Calendar, BookOpen, LogOut, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Calendar, label: "Events", href: "/admin/dashboard/events" },
  { icon: BookOpen, label: "Guides", href: "/admin/dashboard/guides" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-border flex flex-col min-h-screen">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-border">
        <Link href="/" className="flex items-center gap-1.5">
          <span className="font-display text-2xl text-primary">λ</span>
          <div>
            <p className="font-display text-base text-text leading-none">ASSOC</p>
            <p className="text-xs text-muted">Admin</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const active =
            item.href === "/admin/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "admin-sidebar-item",
                active && "active"
              )}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border space-y-1">
        <Link
          href="/"
          target="_blank"
          className="admin-sidebar-item text-muted hover:text-text"
        >
          <ExternalLink size={16} /> View Site
        </Link>
        <button
          onClick={handleLogout}
          className="admin-sidebar-item w-full text-left text-muted hover:text-red-600 hover:bg-red-50"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
