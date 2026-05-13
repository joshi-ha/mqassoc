"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  LayoutDashboard, Calendar, BookOpen, Users, Building2,
  LogOut, ExternalLink, ChevronLeft, ChevronRight, X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard", exact: true },
  { icon: Calendar,        label: "Events",    href: "/admin/dashboard/events" },
  { icon: BookOpen,        label: "Guides",    href: "/admin/dashboard/guides" },
]

const DISABLED_ITEMS = [
  { icon: Users,     label: "Cabinet",  href: "/admin/dashboard/cabinet" },
  { icon: Building2, label: "Sponsors", href: "/admin/dashboard/sponsors" },
]

interface Props {
  collapsed: boolean
  onToggleCollapse: () => void
  mobile?: boolean
}

export function AdminSidebar({ collapsed, onToggleCollapse, mobile }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user?.email ?? null)
    })
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  const isCollapsed = collapsed && !mobile
  const w = isCollapsed ? 72 : 240

  return (
    <aside
      className="flex flex-col h-full min-h-screen bg-white border-r border-border transition-all duration-200"
      style={{ width: w }}
    >
      {/* Logo / header */}
      <div
        className={cn(
          "flex items-center border-b border-border shrink-0 h-14",
          isCollapsed ? "justify-center px-5" : "justify-between px-5",
        )}
      >
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-1.5" tabIndex={-1}>
            <span className="font-display text-2xl text-primary">λ</span>
            <div>
              <p className="font-display text-sm leading-none text-text">ASSOC</p>
              <p className="text-[10px] text-muted">Admin</p>
            </div>
          </Link>
        )}
        {isCollapsed && (
          <Link href="/" tabIndex={-1}>
            <span className="font-display text-2xl text-primary">λ</span>
          </Link>
        )}
        {mobile && (
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-md text-muted hover:bg-cream transition-colors"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                "flex items-center rounded-lg transition-colors duration-150",
                isCollapsed ? "h-10 w-10 mx-auto justify-center" : "gap-3 px-3 h-10",
                active
                  ? "bg-primary text-white"
                  : "text-text hover:bg-cream hover:text-primary",
              )}
            >
              <item.icon size={16} className="shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Link>
          )
        })}

        {!isCollapsed && (
          <div className="pt-3 pb-1 px-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted opacity-60">
              Coming soon
            </p>
          </div>
        )}
        {DISABLED_ITEMS.map((item) => (
          <div
            key={item.href}
            title={isCollapsed ? item.label : undefined}
            className={cn(
              "flex items-center rounded-lg cursor-not-allowed select-none text-muted opacity-40",
              isCollapsed ? "h-10 w-10 mx-auto justify-center" : "gap-3 px-3 h-10",
            )}
          >
            <item.icon size={16} className="shrink-0" />
            {!isCollapsed && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="shrink-0 py-3 px-2 space-y-0.5 border-t border-border">
        {userEmail && !isCollapsed && (
          <div className="px-3 py-2">
            <p className="text-xs text-muted truncate opacity-70">{userEmail}</p>
          </div>
        )}

        <Link
          href="/"
          target="_blank"
          title={isCollapsed ? "View Site" : undefined}
          className={cn(
            "flex items-center rounded-lg transition-colors text-muted hover:bg-cream hover:text-primary",
            isCollapsed ? "h-10 w-10 mx-auto justify-center" : "gap-3 px-3 h-10",
          )}
        >
          <ExternalLink size={15} className="shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">View Site</span>}
        </Link>

        <button
          onClick={handleLogout}
          title={isCollapsed ? "Sign Out" : undefined}
          className={cn(
            "flex items-center rounded-lg transition-colors w-full text-muted hover:bg-red-50 hover:text-red-600",
            isCollapsed ? "h-10 w-10 mx-auto justify-center" : "gap-3 px-3 h-10",
          )}
        >
          <LogOut size={15} className="shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Sign Out</span>}
        </button>

        {!mobile && (
          <button
            onClick={onToggleCollapse}
            className={cn(
              "flex items-center rounded-lg transition-colors w-full text-muted hover:bg-cream",
              isCollapsed ? "h-10 w-10 mx-auto justify-center" : "gap-3 px-3 h-10",
            )}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed
              ? <ChevronRight size={15} />
              : <><ChevronLeft size={15} /><span className="text-xs font-medium">Collapse</span></>
            }
          </button>
        )}
      </div>
    </aside>
  )
}
