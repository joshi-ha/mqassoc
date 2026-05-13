"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

export type ToastType = "success" | "error" | "info"

export interface Toast {
  id: string
  message: string
  type: ToastType
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).slice(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { toasts, addToast, removeToast }
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 size={16} className="shrink-0" />,
  error: <AlertCircle size={16} className="shrink-0" />,
  info: <Info size={16} className="shrink-0" />,
}

const styles: Record<ToastType, string> = {
  success:
    "bg-white border-l-4 border-emerald-500 text-[var(--color-text)] shadow-lg",
  error:
    "bg-white border-l-4 border-red-500 text-[var(--color-text)] shadow-lg",
  info:
    "bg-white border-l-4 border-[var(--color-primary)] text-[var(--color-text)] shadow-lg",
}

const iconStyles: Record<ToastType, string> = {
  success: "text-emerald-500",
  error: "text-red-500",
  info: "text-[var(--color-primary)]",
}

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 64, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 64, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={cn(
              "flex items-start gap-3 px-4 py-3 rounded-xl pointer-events-auto",
              styles[toast.type]
            )}
          >
            <span className={iconStyles[toast.type]}>{icons[toast.type]}</span>
            <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>
            <button
              onClick={() => onRemove(toast.id)}
              className="text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors shrink-0 mt-0.5"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
