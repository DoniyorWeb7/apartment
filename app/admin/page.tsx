'use client';
import { ApartTable } from '@/components/shared/apart-table';
import { Siderbar } from '@/components/shared/siderbar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Breadcrump } from '@/components/shared/breadcrump';
import { LogoutButton } from '@/components/shared/logout-button';
import { ModeToggle } from '@/components/shared/mode-toogle';
export default function Page() {
  return (
    <SidebarProvider>
      <Siderbar />
      <div className="w-full">
        <div className="flex justify-between items-center">
          <div className="flex gap-[5px] items-center">
            <SidebarTrigger />
            <Breadcrump />
          </div>
          <div className="flex gap-3">
            <ModeToggle />
            <LogoutButton className="mr-[30px]" />
          </div>
        </div>
        <div>
          <ApartTable />
        </div>
      </div>
    </SidebarProvider>
  );
}
