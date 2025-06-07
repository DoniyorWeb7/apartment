import { prisma } from '@/prisma/prisma-client';
import { hash } from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Ошибка при получении пользователя:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Некорректный ID' }, { status: 400 });
    }


    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json({ message: 'Пользователь удалён' });
  } catch (error) {
    console.error('Ошибка при удалении пользователя:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const userId = Number(id);
    const body = await req.json();
    const updateUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username: body.username,
        fullName: body.fullName,
        phone: body.phone,
        passport: body.passport,
        ...(body.password && { password: await hash(body.password, 10) }),
      },
    });
    return NextResponse.json(updateUser);
  } catch {
    return NextResponse.json({ error: 'Ошибка при обновлении пользователя' }, { status: 500 });
  }
}
