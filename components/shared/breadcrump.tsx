'use client';
import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
interface Props {
  className?: string;
}

export const Breadcrump: React.FC<Props> = ({ className }) => {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const translations: Record<string, string> = {
    admin: 'Квартиры',
    'for-sale': 'Квартиры по продажам',
    users: 'Пользователи',
    owners: 'Владельцы',
  };

  const breadcrumbItems = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const name =
      translations[segment] ??
      segment.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

    return {
      name,
      href,
      isLast: index === segments.length - 1,
    };
  });

  return (
    <div className={cn('ml-4', className)}>
      <Breadcrumb>
        <BreadcrumbList className="gap-[2px]">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Дом</BreadcrumbLink>
          </BreadcrumbItem>

          {breadcrumbItems.map((item, index) => (
            <div className="flex items-center gap-[2px]" key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {item.isLast ? (
                  <BreadcrumbPage>{item.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.name}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};
