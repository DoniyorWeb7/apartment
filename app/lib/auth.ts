import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '@/prisma/prisma-client';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: Number(decoded.userId) },
    });

    return user;
  } catch {
    return null;
  }
}
