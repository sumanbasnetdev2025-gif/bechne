'use client'
import { useState } from 'react'
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react'

interface Filters {
  condition?: string
  minPrice?: number
  maxPrice?: number
  deliveryType?: string
  city?: string
}

interface BookFiltersProps {
  filters: Filters
  onChange: (filters: Filters) => void
}

const CONDITIONS = [
  { value: '', label: 'Any Condition' },
  { value: 'like_new', label: '🌟 Like New' },
  { value: 'good', label: '✅ Good' },
  { value: 'fair', label: '📗 Fair' },
  { value: 'acceptable', label: '📄 Acceptable' },
]

const DELIVERY = [
  { value: '', label: 'Any Delivery' },
  { value: 'pickup', label: '🤝 Pickup' },
  { value: 'shipping', label: '📦 Shipping' },
  { value: 'both', label: '✨ Both' },
]

export function BookFilters({ filters, onChange }: BookFiltersProps) {
  const [open, setOpen] = useState(false)
  const activeCount = Object.values(filters).filter(Boolean).length

  const update = (key: keyof Filters, value: string | number | undefined) => {
    onChange({ ...filters, [key]: value || undefined })
  }

  const reset = () => onChange({})

  const Select = ({
    label,
    options,
    value,
    onSelect,
  }: {
    label: string
    options: { value: string; label: string }[]
    value?: string
    onSelect: (v: string) => void
  }) => (
    <div className="relative">
      <select
        value={value || ''}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full appearance-none pl-3 pr-8 py-2.5 text-sm border border-stone-200 rounded-xl bg-white text-stone-700 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
      />
    </div>
  )

  return (
    <div>
      {/* Toggle button */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 px-4 py-2.5 border-2 border-stone-200 rounded-xl text-stone-600 hover:border-amber-400 hover:text-amber-800 transition-colors text-sm font-medium bg-white"
      >
        <SlidersHorizontal size={16} />
        Filters
        {activeCount > 0 && (
          <span className="bg-amber-800 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {/* Filter panel */}
      {open && (
        <div className="mt-3 p-4 bg-white border border-stone-100 rounded-2xl shadow-lg grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-1.5">
              Condition
            </label>
            <Select
              label="Condition"
              options={CONDITIONS}
              value={filters.condition}
              onSelect={(v) => update('condition', v)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-1.5">
              Delivery
            </label>
            <Select
              label="Delivery"
              options={DELIVERY}
              value={filters.deliveryType}
              onSelect={(v) => update('deliveryType', v)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-1.5">
              Min Price (Rs.)
            </label>
            <input
              type="number"
              placeholder="0"
              value={filters.minPrice || ''}
              onChange={(e) =>
                update('minPrice', e.target.value ? Number(e.target.value) : undefined)
              }
              className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl bg-white text-stone-700 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-1.5">
              Max Price (Rs.)
            </label>
            <input
              type="number"
              placeholder="Any"
              value={filters.maxPrice || ''}
              onChange={(e) =>
                update('maxPrice', e.target.value ? Number(e.target.value) : undefined)
              }
              className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl bg-white text-stone-700 focus:outline-none focus:border-amber-400"
            />
          </div>

          {activeCount > 0 && (
            <div className="col-span-2 md:col-span-4 flex justify-end">
              <button
                onClick={reset}
                className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors font-medium"
              >
                <X size={14} /> Clear filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}