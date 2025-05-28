'use client';
import { Breadcrump } from '@/components/shared/breadcrump';
import { Siderbar } from '@/components/shared/siderbar';
import { UsersTable } from '@/components/shared/users-table';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import React from 'react';

export default function Page() {
  return (
    <SidebarProvider>
      <Siderbar />
      <div className="w-full">
        <div className="flex items-center">
          <SidebarTrigger />
          <Breadcrump />
        </div>

        <div>
          <UsersTable />
        </div>
      </div>
    </SidebarProvider>
  );
}
