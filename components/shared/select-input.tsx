'use client';
import React from 'react';

import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface Option {
  label: string;
  value: string;
}

interface Props {
  className?: string;
  nameLabel: string;
  title: string;
  valueInput?: string;
  onChange: (str: string) => void;
  error?: string;
  options: Option[];
}

export const SelectInput: React.FC<Props> = ({
  className,
  nameLabel,
  title,
  valueInput = '',
  onChange,
  error,
  options,
}) => {
  const [open, setOpen] = React.useState(false);
  const selectedLabel = options.find((f) => f.value === valueInput)?.label;

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <div className="mb-3">
          <p className={cn('mb-1')}>{title}</p>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between">
              {selectedLabel || nameLabel}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
        </div>
        <PopoverContent className="w-full p-0 pointer-events-auto ">
          <Command>
            <CommandInput placeholder="Search framework..." className="h-9" />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue);
                      setOpen(false);
                    }}>
                    {option.label}
                    <Check
                      className={cn(
                        'ml-auto',
                        valueInput === option.value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};
