import * as React from 'react'

interface ProgressProps {
  value?: number
  className?: string
}

export function Progress({ value = 0, className = '' }: ProgressProps) {
  return (
    <div className={`w-full h-2 bg-muted rounded overflow-hidden ${className}`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value)}>
      <div
        className="h-full bg-primary transition-all"
        style={{ width: `${Math.max(0, Math.min(100, Math.round(value)))}%` }}
      />
    </div>
  )
}

export default Progress
