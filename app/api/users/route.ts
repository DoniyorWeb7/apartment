import { prisma } from '@/prisma/prisma-client';
import { Role } from '@prisma/client';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';
export async function GET() {
  const user = await prisma.user.findMany({
    orderBy: {
      id: 'desc',
    },
  });
  return NextResponse.json(user);
}

export async function POST(req: Request) {
  const body = await req.json();
  const role = body.role === 'ADMIN' ? Role.ADMIN : Role.USER;
  const hashedPassword = await hash(body.password, 10);
  const newUser = await prisma.user.create({
    data: {
      fullName: body.fullName,
      username: body.username,
      phone: body.phone,
      passport: body.passport,
      availabilityPas: body.availabilityPas,
      password: hashedPassword,
      role: role,
    },
  });
  return NextResponse.json(newUser, { status: 201 });
}
