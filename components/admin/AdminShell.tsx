"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { AdminSidebar } from "./AdminSidebar"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"

const PAGE_TITLES: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/dashboard/events": "Events",
  "/admin/dashboard/guides": "Guides",
  "/admin/dashboard/cabinet": "Cabinet",
  "/admin/dashboard/sponsors": "Sponsors",
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const pageTitle = PAGE_TITLES[pathname] ?? "Admin"

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex shrink-0">
        <AdminSidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((p) => !p)}
        />
      </div>

      {/* Mobile overlay sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="p-0 border-0 bg-white"
          style={{ width: 260 }}
        >
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>
          <AdminSidebar
            collapsed={false}
            onToggleCollapse={() => setMobileOpen(false)}
            mobile
          />
        </SheetContent>
      </Sheet>

      {/* Content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden h-14 flex items-center justify-between px-4 border-b border-border bg-white shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg text-muted hover:bg-cream transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <span className="font-display text-lg text-text">{pageTitle}</span>
          <div className="w-9" />
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
