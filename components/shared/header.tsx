'use client';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import React from 'react';
import { Button } from '../ui/button';
import { signOut } from 'next-auth/react';
import { LogoutButton } from './logout-button';
interface Props {
  className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
  const { data: session, status } = useSession();
  if (status === 'loading') return <div>Загрузка...</div>;
  if (!session) return <div>Вы не вошли</div>;

  return (
    <div
      className={cn(
        'w-full h-[70px] bg-amber-100 absolute top-0 flex justify-end items-center pr-[100px]',
        className,
      )}>
      {session?.user?.name}
      <LogoutButton />
    </div>
  );
};
