import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { PageHeader } from '@/components/PageHeader'
import { useUserSettings } from '@/hooks/usePlanQueries'

const settingsSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  investmentTargetPercent: z.number().min(0).max(100),
  notificationsEnabled: z.boolean(),
})

type SettingsForm = z.infer<typeof settingsSchema>

export function ConfiguracionPage() {
  const { data: user, isLoading } = useUserSettings()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    values: user
      ? {
          name: user.name,
          investmentTargetPercent: user.investmentTargetPercent,
          notificationsEnabled: user.notificationsEnabled,
        }
      : undefined,
  })

  const onSubmit = (data: SettingsForm) => {
    console.log('Configuración guardada (mock):', data)
  }

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-muted-foreground">Cargando configuración...</p>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Configuración"
        description="Preferencias de tu planificación financiera."
      />

      <Card className="max-w-lg border-border/60 shadow-none">
        <CardHeader>
          <CardTitle className="text-base">Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <input
                id="name"
                {...register('name')}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="investmentTargetPercent">Meta de inversión (%)</Label>
              <input
                id="investmentTargetPercent"
                type="number"
                {...register('investmentTargetPercent', { valueAsNumber: true })}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {errors.investmentTargetPercent && (
                <p className="text-xs text-destructive">
                  {errors.investmentTargetPercent.message}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                id="notificationsEnabled"
                type="checkbox"
                {...register('notificationsEnabled')}
                className="size-4 rounded border-input"
              />
              <Label htmlFor="notificationsEnabled">Recibir recordatorios</Label>
            </div>

            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Moneda: {user.currency}</p>
              <p>Región: {user.locale}</p>
            </div>

            <Button type="submit">Guardar cambios</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
