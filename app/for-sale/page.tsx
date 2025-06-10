import { Breadcrump } from '@/components/shared/breadcrump';
import { SaleApartTable } from '@/components/shared/sale-apart-table';
import { Siderbar } from '@/components/shared/siderbar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function Page() {
  return (
    <SidebarProvider>
      <Siderbar />
      <div className="w-full">
        <div className="flex items-center">
          <SidebarTrigger />
          <Breadcrump />
        </div>
        <SaleApartTable />
      </div>
    </SidebarProvider>
  );
}
