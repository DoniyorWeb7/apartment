'use client';
import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ru } from 'date-fns/locale';
interface Props {
  className?: string;
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}

export const DateInput: React.FC<Props> = ({ date, setDate }) => {
  return (
    <Popover>
      <p>Дата доступности</p>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal mb-5',
            !date && 'text-muted-foreground',
          )}>
          <CalendarIcon />
          {date ? format(date, 'PPP', { locale: ru }) : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w- p-0 pointer-events-auto" align="start">
        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
      </PopoverContent>
    </Popover>
  );
};
