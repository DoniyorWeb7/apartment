'use client';
import React from 'react';
import { Checkbox } from '../ui/checkbox';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
  text: string;
}

export const CreateCheckbox: React.FC<Props> = ({ className, text }) => {
  return (
    <div className={cn(className, 'flex items-center space-x-2 ')}>
      <Checkbox className="cursor-pointer" id="terms" />
      <label
        htmlFor="terms"
        className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {text}
      </label>
    </div>
  );
};
