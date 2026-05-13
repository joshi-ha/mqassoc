"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import type { GuideSection } from "@/types"

export function GuideTOC({ sections }: { sections: GuideSection[] }) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (!sections.length) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    )

    sections.forEach((s) => {
      const el = document.getElementById(`section-${s.id}`)
      if (el) observerRef.current?.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [sections])

  if (!sections.length) return null

  return (
    <div className="sticky top-28">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)] mb-3">
        In This Guide
      </p>
      <nav className="space-y-1">
        {sections.map((s) => {
          const active = activeId === `section-${s.id}`
          return (
            <a
              key={s.id}
              href={`#section-${s.id}`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(`section-${s.id}`)?.scrollIntoView({ behavior: "smooth" })
              }}
              className={cn(
                "block text-sm py-1 pl-3 border-l-2 transition-all duration-150 leading-snug",
                active
                  ? "border-[var(--color-primary)] text-[var(--color-primary)] font-medium"
                  : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-border)]"
              )}
            >
              {s.question}
            </a>
          )
        })}
      </nav>
    </div>
  )
}
