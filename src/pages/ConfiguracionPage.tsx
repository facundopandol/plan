import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Moon, Palette, PiggyBank, User, Wallet } from 'lucide-react'
import { PageListSkeleton } from '@/components/shared/PageListSkeleton'
import { PageHeader } from '@/components/PageHeader'
import { ColorPicker } from '@/components/configuracion/ColorPicker'
import { DarkModeToggle } from '@/components/configuracion/DarkModeToggle'
import { SettingCard, SettingRow } from '@/components/configuracion/SettingCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePlan, useSettings } from '@/hooks/usePlan'
import {
  settingsFormSchema,
  type SettingsFormValues,
} from '@/schemas/configuracionSchemas'
import type { CurrencyCode, PrimaryColor } from '@/types'
import { CURRENCY_OPTIONS } from '@/utils/theme'

export function ConfiguracionPage() {
  const { isLoading } = usePlan()
  const { settings, saveSettings, isSaved } = useSettings()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    values: {
      name: settings.name,
      currency: settings.currency,
      monthlySavingsGoal: settings.monthlySavingsGoal,
      monthlyInvestmentGoal: settings.monthlyInvestmentGoal,
      primaryColor: settings.primaryColor,
      darkMode: settings.darkMode,
    },
  })

  const currency = watch('currency')
  const primaryColor = watch('primaryColor')
  const darkMode = watch('darkMode')

  const onSubmit = (data: SettingsFormValues) => {
    saveSettings({
      ...settings,
      ...data,
      locale: settings.locale,
    })
  }

  if (isLoading) {
    return <PageListSkeleton />
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Configuración"
        description="Personalizá tu experiencia de planificación financiera."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <SettingCard
          title="Perfil"
          description="Tu identidad en la aplicación"
          icon={User}
        >
          <SettingRow label="Nombre" hint="Cómo te saludamos en el dashboard" htmlFor="name">
            <Input id="name" {...register('name')} className="bg-background" />
          </SettingRow>
          {errors.name && (
            <p className="px-5 pb-3 text-xs text-destructive">{errors.name.message}</p>
          )}
        </SettingCard>

        <SettingCard
          title="Moneda"
          description="Formato de montos en toda la app"
          icon={Wallet}
        >
          <SettingRow label="Moneda principal" hint="Afecta el símbolo y formato">
            <Select
              value={currency}
              onValueChange={(v) => setValue('currency', v as CurrencyCode, { shouldDirty: true })}
            >
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SettingRow>
        </SettingCard>

        <SettingCard
          title="Objetivos mensuales"
          description="Metas de planificación para cada mes"
          icon={PiggyBank}
        >
          <SettingRow
            label="Objetivo de ahorro"
            hint="Cuánto querés ahorrar por mes"
            htmlFor="monthlySavingsGoal"
          >
            <Input
              id="monthlySavingsGoal"
              type="number"
              min={0}
              step={10000}
              className="bg-background tabular-nums"
              {...register('monthlySavingsGoal', { valueAsNumber: true })}
            />
          </SettingRow>
          {errors.monthlySavingsGoal && (
            <p className="px-5 pb-3 text-xs text-destructive">
              {errors.monthlySavingsGoal.message}
            </p>
          )}

          <SettingRow
            label="Reserva mensual de ahorro / inversión"
            hint="Cuánto destinás a invertir mensualmente"
            htmlFor="monthlyInvestmentGoal"
          >
            <Input
              id="monthlyInvestmentGoal"
              type="number"
              min={0}
              step={10000}
              className="bg-background tabular-nums"
              {...register('monthlyInvestmentGoal', { valueAsNumber: true })}
            />
          </SettingRow>
          {errors.monthlyInvestmentGoal && (
            <p className="px-5 pb-3 text-xs text-destructive">
              {errors.monthlyInvestmentGoal.message}
            </p>
          )}
        </SettingCard>

        <SettingCard
          title="Apariencia"
          description="Personalizá el look & feel"
          icon={Palette}
        >
          <SettingRow label="Color principal" hint="Botones, acentos y sidebar activo">
            <ColorPicker
              value={primaryColor}
              onChange={(color) =>
                setValue('primaryColor', color as PrimaryColor, { shouldDirty: true })
              }
            />
          </SettingRow>

          <SettingRow label="Modo oscuro" hint="Interfaz con fondo oscuro">
            <div className="flex items-center justify-end gap-3">
              <Moon className="size-4 text-muted-foreground" />
              <DarkModeToggle
                checked={darkMode}
                onChange={(checked) => setValue('darkMode', checked, { shouldDirty: true })}
              />
            </div>
          </SettingRow>
        </SettingCard>

        <div className="sticky bottom-4 flex items-center justify-between rounded-xl border border-border/50 bg-card/95 px-5 py-3 shadow-sm backdrop-blur-sm">
          <p className="text-xs text-muted-foreground">
            {isSaved ? (
              <span className="flex items-center gap-1.5 text-emerald-600">
                <Check className="size-3.5" />
                Cambios guardados
              </span>
            ) : isDirty ? (
              'Tenés cambios sin guardar'
            ) : (
              'Configuración al día'
            )}
          </p>
          <Button type="submit" disabled={!isDirty}>
            Guardar cambios
          </Button>
        </div>
      </form>
    </div>
  )
}
