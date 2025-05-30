import { prisma } from '@/prisma/prisma-client';
import { NextResponse } from 'next/server';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const apart = await prisma.apartment.findUnique({
      where: { id: Number(id) },
    });

    if (!apart) {
      return NextResponse.json({ error: 'Квартира не найден' }, { status: 404 });
    }

    return NextResponse.json(apart, { status: 200 });
  } catch (error) {
    console.error('Ошибка при получении квартра:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const apartId = parseInt(id, 10);
    if (isNaN(apartId)) {
      return NextResponse.json({ error: 'Некорректный ID' }, { status: 400 });
    }

    // Проверяем существование квартиры перед удалением
    const existingApartment = await prisma.apartment.findUnique({
      where: { id: apartId },
    });

    if (!existingApartment) {
      return NextResponse.json({ error: 'Квартира не найдена' }, { status: 404 });
    }

    await prisma.apartment.delete({ where: { id: apartId } });
    return NextResponse.json({ message: 'Квартира удалён' });
  } catch (error) {
    console.error('Ошибка при удалении пользователя:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const apartId = Number(id);
    const body = await req.json();
    const updateApart = await prisma.apartment.update({
      where: { id: apartId },
      data: {
        status: body.status,
        images: body.images,
        coverImage: body.coverImage,
        availability: new Date(body.availability),
        price: Number(body.price),
        district: body.district,
        adress: body.adress,
        room: Number(body.room),
        floor: Number(body.floor),
        floorBuild: Number(body.floorBuild),
        square: Number(body.square),
        variant: body.variant,
        description: body.description,
        owner: body.owner,
        // user: body.userId ? { connect: { id: Number(body.userId) } } : undefined,
      },
    });
    return NextResponse.json(updateApart);
  } catch (error) {
    console.error('PUT apartment error:', error);
    return new Response('Failed to update apartment', { status: 500 });
  }
}
