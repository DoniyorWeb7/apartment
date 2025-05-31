import { prisma } from '@/prisma/prisma-client';
import { Prisma } from '@prisma/client';
import { put } from '@vercel/blob';
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

// export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
//   const { id } = await params;

//   try {
//     const apartId = Number(id);
//     const body = await req.json();
//     const updateApart = await prisma.apartment.update({
//       where: { id: apartId },
//       data: {
//         status: body.status,
//         images: body.images,
//         coverImage: body.coverImage,
//         availability: new Date(body.availability),
//         price: Number(body.price),
//         district: body.district,
//         adress: body.adress,
//         room: Number(body.room),
//         floor: Number(body.floor),
//         floorBuild: Number(body.floorBuild),
//         square: Number(body.square),
//         variant: body.variant,
//         description: body.description,
//         owner: body.owner,
//         // user: body.userId ? { connect: { id: Number(body.userId) } } : undefined,
//       },
//     });
//     return NextResponse.json(updateApart);
//   } catch (error) {
//     console.error('PUT apartment error:', error);
//     return new Response('Failed to update apartment', { status: 500 });
//   }
// }

// export async function PUT(req: Request, { params }: { params: { id: string } }) {
//   const { id } = params;

//   try {
//     const formData = await req.formData();
//     const apartId = Number(id);

//     // Получаем текстовые данные из formData
//     const status = formData.get('status') as string;
//     const availability = formData.get('availability') as string;
//     const price = formData.get('price') as string;
//     const district = formData.get('district') as string;
//     const adress = formData.get('adress') as string;
//     const room = formData.get('room') as string;
//     const floor = formData.get('floor') as string;
//     const floorBuild = formData.get('floorBuild') as string;
//     const square = formData.get('square') as string;
//     const variant = formData.get('variant') as string;
//     const description = formData.get('description') as string;
//     const owner = formData.get('owner') as string;

//     // Получаем файлы
//     const coverImage = formData.get('cover') as File | null;
//     const images = formData.getAll('images') as File[];

//     // Обновляем данные квартиры
//     const updateData: any = {
//       status,
//       availability: new Date(availability),
//       price: Number(price),
//       district,
//       adress,
//       room: Number(room),
//       floor: Number(floor),
//       floorBuild: Number(floorBuild),
//       square: Number(square),
//       variant,
//       description,
//       owner,
//     };

//     // Если есть новое обложка, добавляем в данные для обновления
//     if (coverImage && coverImage.size > 0) {
//       // Здесь нужно реализовать загрузку файла в хранилище (например, S3 или файловую систему)
//       // и получить URL для сохранения в БД
//       const coverImageUrl = await uploadFile(coverImage);
//       updateData.coverImage = coverImageUrl;
//     }

//     // Если есть новые изображения, обрабатываем их
//     if (images && images.length > 0 && images[0].size > 0) {
//       const imageUrls = await Promise.all(images.map(uploadFile));
//       updateData.images = imageUrls;
//     }

//     const updateApart = await prisma.apartment.update({
//       where: { id: apartId },
//       data: updateData,
//     });

//     return NextResponse.json(updateApart);
//   } catch (error) {
//     console.error('PUT apartment error:', error);
//     return new Response('Failed to update apartment', { status: 500 });
//   }
// }

// // Вспомогательная функция для загрузки файлов (нужно реализовать под вашу инфраструктуру)
// async function uploadFile(file: File): Promise<string> {
//   // Здесь реализуйте логику загрузки файла в ваше хранилище
//   // и верните URL загруженного файла
//   // Например, загрузка в S3, Cloudinary или файловую систему
//   throw new Error('File upload implementation needed');
// }

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const formData = await req.formData();
    const apartId = Number(id);

    if (isNaN(apartId)) {
      return NextResponse.json({ error: 'Invalid apartment ID' }, { status: 400 });
    }

    // Получаем текстовые данные
    const textData = {
      status: formData.get('status') as string,
      availability: new Date(formData.get('availability') as string),
      price: Number(formData.get('price')),
      district: formData.get('district') as string,
      adress: formData.get('adress') as string,
      room: Number(formData.get('room')),
      floor: Number(formData.get('floor')),
      floorBuild: Number(formData.get('floorBuild')),
      square: Number(formData.get('square')),
      variant: formData.get('variant') as string,
      description: formData.get('description') as string,
      owner: formData.get('owner') as string,
    };

    // Обработка файлов
    const coverImage = formData.get('cover') as File | null;
    const images = formData.getAll('images') as File[];

    const updateData: Prisma.ApartmentUpdateInput = { ...textData };

    // Загрузка обложки
    if (coverImage instanceof File && coverImage.size > 0) {
      try {
        const blob = await put(`apartments/cover-${Date.now()}`, coverImage, {
          access: 'public',
        });
        updateData.coverImage = blob.url;
      } catch (error) {
        console.error('Ошибка загрузки обложки:', error);
        // Можно добавить обработку ошибки (например, toast.notify)
      }
    } else if (coverImage === null) {
      // Если передано явное null - очищаем обложку
      updateData.coverImage = null;
    }

    // Загрузка дополнительных изображений
    if (images?.length > 0 && images[0].size > 0) {
      const imageUrls = await Promise.all(
        images.map((file, index) =>
          put(`apartments/image-${Date.now()}-${index}`, file, {
            access: 'public',
          }),
        ),
      );
      updateData.images = imageUrls.map((blob) => blob.url);
    }

    // Обновление данных в базе
    const updatedApartment = await prisma.apartment.update({
      where: { id: apartId },
      data: updateData,
    });

    return NextResponse.json(updatedApartment);
  } catch (error) {
    console.error('PUT apartment error:', error);
    return NextResponse.json(
      { error: 'Failed to update apartment', details: error instanceof Error ? error.message : '' },
      { status: 500 },
    );
  }
}
