import { prisma } from '@/prisma/prisma-client';
import { NextResponse } from 'next/server';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const owner = await prisma.owner.findUnique({
      where: { id: Number(id) },
    });

    if (!owner) {
      return NextResponse.json({ error: 'Владелец не найден' }, { status: 404 });
    }
    return NextResponse.json(owner, { status: 200 });
  } catch (error) {
    console.error('Ошибка при получении пользователя:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const ownerId = Number(id);
    const body = await req.json();
    const updateOwner = await prisma.owner.update({
      where: { id: ownerId },
      data: {
        fullName: body.fullName,
        phone: body.phone,
      },
    });
    return NextResponse.json(updateOwner);
  } catch {
    return NextResponse.json({ error: 'Ошибка при обновлении пользователя' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const ownerId = Number(id);
    if (isNaN(ownerId)) {
      return NextResponse.json({ error: 'Некорректный ID' }, { status: 400 });
    }

    await prisma.owner.delete({ where: { id: ownerId } });
    return NextResponse.json({ message: 'Владелец удалён' });
  } catch (error) {
    console.error('Ошибка при удалении пользователя:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
