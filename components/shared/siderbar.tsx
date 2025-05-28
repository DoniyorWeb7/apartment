'use client';
import { Home, Inbox, User } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const items = [
  {
    title: 'Квартиры',
    url: '/admin',
    icon: Home,
  },
  {
    title: 'Квартиры по продажам',
    url: '/for-sale',
    icon: Home,
  },
  {
    title: 'Пользователи',
    url: '/users',
    icon: Inbox,
    adminOnly: true,
  },
  {
    title: 'Владельцы',
    url: '/owners',
    icon: User,
  },
];

export function Siderbar() {
  const { data: session } = useSession();
  const filteredItems = items.filter((item) => {
    if (item.adminOnly && session?.user?.role !== 'ADMIN') {
      return false;
    }
    return true;
  });
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Панель управления</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className="h-[45px]" asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span className="text-[16px]">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
