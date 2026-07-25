import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { CheckCircle2, X, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastVariant = 'success' | 'error'

export interface ToastInput {
  title: string
  description?: string
  variant?: ToastVariant
}

interface ToastItem extends Required<Pick<ToastInput, 'title' | 'variant'>> {
  id: string
  description?: string
}

interface ToastContextValue {
  toast: {
    success: (title: string, description?: string) => void
    error: (title: string, description?: string) => void
  }
}

const ToastContext = createContext<ToastContextValue | null>(null)

const AUTO_DISMISS_MS = 3500

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }, [])

  const push = useCallback(
    (input: ToastInput) => {
      const id = crypto.randomUUID()
      const item: ToastItem = {
        id,
        title: input.title,
        description: input.description,
        variant: input.variant ?? 'success',
      }
      setItems((current) => [...current, item].slice(-4))
      window.setTimeout(() => dismiss(id), AUTO_DISMISS_MS)
    },
    [dismiss],
  )

  const value = useMemo<ToastContextValue>(
    () => ({
      toast: {
        success: (title, description) => push({ title, description, variant: 'success' }),
        error: (title, description) => push({ title, description, variant: 'error' }),
      },
    }),
    [push],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-end gap-2 p-4 sm:bottom-4 sm:right-4 sm:left-auto sm:w-auto"
        aria-live="polite"
        aria-relevant="additions"
      >
        {items.map((item) => {
          const Icon = item.variant === 'success' ? CheckCircle2 : XCircle
          return (
            <div
              key={item.id}
              role="status"
              className={cn(
                'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm sm:w-[360px]',
                item.variant === 'success'
                  ? 'border-emerald-200/80 bg-emerald-50/95 text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/90 dark:text-emerald-50'
                  : 'border-destructive/30 bg-destructive/10 text-foreground dark:border-destructive/40 dark:bg-destructive/20',
              )}
            >
              <Icon
                className={cn(
                  'mt-0.5 size-4 shrink-0',
                  item.variant === 'success'
                    ? 'text-emerald-600 dark:text-emerald-300'
                    : 'text-destructive',
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{item.title}</p>
                {item.description ? (
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                className="rounded-md p-0.5 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Cerrar notificación"
              >
                <X className="size-3.5" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

export function getActionErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message.trim() ? error.message : fallback
}
