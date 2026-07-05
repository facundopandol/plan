import {
  Building,
  Car,
  GraduationCap,
  Heart,
  Home,
  Luggage,
  PiggyBank,
  Plane,
  Shield,
  Target,
  type LucideIcon,
} from 'lucide-react'
import type { GoalIcon } from '@/types'

export const GOAL_ICON_MAP: Record<GoalIcon, LucideIcon> = {
  Target,
  Plane,
  Home,
  Car,
  GraduationCap,
  Heart,
  PiggyBank,
  Shield,
  Luggage,
  Building,
}

interface GoalIconDisplayProps {
  icon: GoalIcon
  className?: string
}

export function GoalIconDisplay({ icon, className }: GoalIconDisplayProps) {
  const Icon = GOAL_ICON_MAP[icon]
  return <Icon className={className} strokeWidth={1.75} />
}
