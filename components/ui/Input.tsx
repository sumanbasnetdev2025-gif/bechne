import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  prefix?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, error, hint, leftIcon, rightIcon, prefix, ...props },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-stone-700 mb-1.5">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
            {hint && (
              <span className="font-normal text-stone-400 ml-1">({hint})</span>
            )}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
              {leftIcon}
            </div>
          )}
          {prefix && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-medium">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full px-4 py-3 rounded-xl border text-stone-800 bg-white outline-none transition-colors',
              'focus:ring-2 focus:ring-amber-400 focus:border-amber-400',
              'placeholder:text-stone-300',
              error
                ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                : 'border-stone-200 hover:border-stone-300',
              leftIcon || prefix ? 'pl-10' : '',
              rightIcon ? 'pr-10' : '',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'