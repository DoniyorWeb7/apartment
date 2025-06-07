import { authConfig } from '@/app/auth.config';
import { prisma } from '@/prisma/prisma-client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const owner = await prisma.owner.findMany({
    orderBy: {
      id: 'asc',
    },
  });
  return NextResponse.json(owner);
}

export async function POST(req: Request) {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id;
  const body = await req.json();

  const newOwner = await prisma.owner.create({
    data: {
      fullName: body.fullName,
      phone: body.phone,
      userId: Number(userId),
    },
  });

  return NextResponse.json(newOwner);
}
