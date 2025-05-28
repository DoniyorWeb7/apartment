'use client';
import { CreateApartModal } from '@/components/shared/create-apart-modal';
import { ApartTable } from '@/components/shared/apart-table';
import { Siderbar } from '@/components/shared/siderbar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Breadcrump } from '@/components/shared/breadcrump';
import { LogoutButton } from '@/components/shared/logout-button';
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
          <div>
            <LogoutButton className="mr-[30px]" />
          </div>
        </div>
        <div>
          <ApartTable />
          <CreateApartModal />
        </div>
      </div>
    </SidebarProvider>
  );
}
