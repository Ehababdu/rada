import React, { useState, useRef, useEffect } from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty, CommandGroup } from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { ChevronsUpDown, LoaderCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface ComboboxProps {
  value: string
  onChange: (value: string) => void
  options: Record<string, string>
  placeholder?: string
  error?: string
  onQueryChange?: (q: string) => void
  isLoading?: boolean
}

export default function Combobox({ value, onChange, options, placeholder = '', error, onQueryChange, isLoading }: ComboboxProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  const entries = Object.entries(options)
  const filtered = onQueryChange ? entries : entries.filter(([, label]) => label.toLowerCase().includes(query.toLowerCase()))
  const selectedLabel = value ? options[value] : ''

  const handleValueChange = (newValue: string) => {
    onChange(newValue)
    setQuery('')
    setOpen(false)
  }

  useEffect(() => {
    if (open) {
      // focus the search input when popover opens
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between ${error ? 'border-destructive' : ''}`}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className={selectedLabel ? '' : 'text-muted-foreground'}>
            {selectedLabel || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" sideOffset={4} className="w-[--radix-popper-anchor-width] p-0">
        {/* Let Command manage highlighting internally; don't call handleValueChange on highlight
          to avoid selecting on mouse hover. Selection happens only via item onSelect (click/enter). */}
        <Command shouldFilter={!onQueryChange}>
          <CommandInput
            ref={inputRef}
            placeholder={t('promotions.search_placeholder')}
            value={query}
            onValueChange={(v: string) => {
              setQuery(v)
              onQueryChange?.(v)
            }}
            className="border-b"
          />
          <CommandList>
            {isLoading && (
              <div className="flex items-center justify-center p-4">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                <span className="ml-2 text-sm text-muted-foreground">{t('loading')}</span>
              </div>
            )}
            {!isLoading && (
              <>
                <CommandEmpty>{t('no_search_results')}</CommandEmpty>
                <CommandGroup className="max-h-48 overflow-y-auto">
                  {filtered.map(([key, label]) => (
                    <CommandItem
                      key={key}
                      value={key}
                      onSelect={() => handleValueChange(key)}
                      className="cursor-pointer"
                    >
                      {label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
