import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { QueryErrorBanner } from '@/components/shared/QueryErrorBanner'
import { MobileBottomNav } from '@/components/layouts/MobileBottomNav'
import { SidebarNav } from '@/components/layouts/Sidebar'
import { TopBar } from '@/components/layouts/TopBar'
import { Sheet, SheetContent } from '@/components/ui/sheet'

export function AppLayout() {
  const [moreOpen, setMoreOpen] = useState(false)

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <aside className="hidden w-60 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarNav />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto overscroll-y-contain">
          <div className="mx-auto max-w-6xl px-4 py-6 pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:py-8 lg:px-8 lg:pb-8">
            <QueryErrorBanner />
            <Outlet />
          </div>
        </main>
        <MobileBottomNav onOpenMore={() => setMoreOpen(true)} />
      </div>

      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="left" className="w-[min(100%,20rem)] p-0 lg:hidden">
          <SidebarNav onNavigate={() => setMoreOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  )
}
