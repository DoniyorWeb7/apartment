import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { signOut, useSession } from 'next-auth/react';
import { ChevronDown } from 'lucide-react';

interface Props {
  className?: string;
}

export const LogoutButton: React.FC<Props> = ({ className }) => {
  const { data: session } = useSession();

  const handleLogout = () => {
    signOut({ redirect: false }).then(() => {
      window.location.href = '/login';
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={className} asChild>
        <Button className="flex items-center gap-2 cursor-pointer" variant="default">
          {session?.user?.name} <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-20">
        <DropdownMenuLabel>Мой профиль</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Профиль</DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>Выйти</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
