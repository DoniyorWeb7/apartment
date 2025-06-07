import { Breadcrump } from '@/components/shared/breadcrump';
import { OwnerTable } from '@/components/shared/owners';
import { Siderbar } from '@/components/shared/siderbar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import React from 'react';



export default function Page() {
  return (
    <div>
      <SidebarProvider>
        <Siderbar />
        <div className="w-full">
          <div className="flex items-center">
            <SidebarTrigger />
            <Breadcrump />
          </div>

          <div>
            <OwnerTable />
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
