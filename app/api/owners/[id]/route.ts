import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const owner = await prisma.owner.findUnique({
      where: { id: Number(params.id) },
    });

    if (!owner) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }
    return NextResponse.json({ owner }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  console.log('ИД владельца', params.id);
  try {
    await prisma.owner.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ message: 'Пользователь удалён' });
  } catch (error) {
    console.error('Ошибка при удалении пользователя:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const ownerId = Number(params.id);
    const body = await req.json();
    const updateOwner = await prisma.owner.update({
      where: { id: ownerId },
      data: {
        fullName: body.fullName,
        phone: body.phone,
      },
    });
    return NextResponse.json(updateOwner);
  } catch (error) {
    console.error('Ошибка при обновлении владельца', error);
    return NextResponse.json({ error: 'Ошибка при обновлении владельца' }, { status: 500 });
  }
}
