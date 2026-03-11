import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface StatsCardProps {
  label: string
  value: string | number
  icon: ReactNode
  sub?: string
  color?: 'amber' | 'emerald' | 'blue' | 'stone'
}

const colors = {
  amber: 'bg-amber-50 text-amber-800',
  emerald: 'bg-emerald-50 text-emerald-800',
  blue: 'bg-blue-50 text-blue-800',
  stone: 'bg-stone-50 text-stone-800',
}

export function StatsCard({ label, value, icon, sub, color = 'amber' }: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={cn('p-2.5 rounded-xl', colors[color])}>{icon}</div>
      </div>
      <div className="text-2xl font-bold text-stone-900 mb-0.5"
        style={{ fontFamily: 'Lora, serif' }}>
        {value}
      </div>
      <div className="text-stone-500 text-sm">{label}</div>
      {sub && <div className="text-stone-400 text-xs mt-1">{sub}</div>}
    </div>
  )
}