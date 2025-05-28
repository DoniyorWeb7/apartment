'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const route = useRouter();
  return (
    <div className="flex items-center justify-center min-h-screen flex-col text-center">
      <h1 className="text-3xl font-bold mb-4">Доступ запрещён</h1>
      <p className="text-gray-600">⛔ У вас нет доступа к этой странице</p>
      <Button className="cursor-pointer mt-4 w-[150px] h-[40px]" onClick={() => route.back()}>
        Назад
      </Button>
    </div>
  );
}
