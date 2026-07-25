import { Link } from 'react-router-dom'
import { ArrowDownCircle, ArrowRight, TrendingUp, Wallet } from 'lucide-react'

const STEPS = [
  {
    to: '/ingresos',
    title: 'Ingresos',
    description: 'Cargá lo que cobrás este mes',
    icon: Wallet,
  },
  {
    to: '/obligaciones',
    title: 'Obligaciones',
    description: 'Definí alquiler, servicios y tarjetas',
    icon: ArrowDownCircle,
  },
  {
    to: '/inversiones',
    title: 'Ahorro',
    description: 'Registrá lo que reservás en ahorro o inversión',
    icon: TrendingUp,
  },
] as const

export function MonthSetupPrompt() {
  return (
    <section
      aria-label="Armá el mes"
      className="rounded-2xl border border-border/50 bg-gradient-to-br from-zinc-50 via-card to-card p-5 md:p-6 dark:from-zinc-900/50 dark:via-card dark:to-card"
    >
      <div className="mb-4">
        <h2 className="text-base font-semibold tracking-tight">Armá el mes</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Empezá por estos tres pasos para ver ingresos, compromisos y dinero libre.
        </p>
      </div>

      <ol className="grid gap-3 sm:grid-cols-3">
        {STEPS.map((step, index) => {
          const Icon = step.icon
          return (
            <li key={step.to}>
              <Link
                to={step.to}
                className="group flex h-full flex-col gap-3 rounded-xl border border-border/50 bg-background/80 p-4 transition-colors hover:border-border hover:bg-muted/30"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-muted/70 text-muted-foreground">
                    <Icon className="size-4" strokeWidth={1.75} />
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {index + 1}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                  Ir
                  <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
