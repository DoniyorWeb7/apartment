import { s3 } from '@/lib/s3Client';
import { prisma } from '@/prisma/prisma-client';
import { PutObjectCommand } from '@aws-sdk/client-s3';
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

    const uploadToS3 = async (file: File) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const key = `apartments/${Date.now()}-${file.name}`;

      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET!,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        ACL: 'public-read',
      });

      await s3.send(command);
      return `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${key}`;
    };

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
    // if (images?.length > 0 && images[0].size > 0) {
    //   const imageUrls = await Promise.all(
    //     images.map((file, index) =>
    //       put(`apartments/image-${Date.now()}-${index}`, file, {
    //         access: 'public',
    //       }),
    //     ),
    //   );
    //   updateData.images = imageUrls.map((blob) => blob.url);
    // }

    const imageUploadPromises = images.map(async (file) => {
      const url = await uploadToS3(file);
      return {
        url,
        isCover: coverImage ? file.name === coverImage.name : false,
      };
    });

    const uploadedImages = await Promise.all(imageUploadPromises);

    const hasCover = uploadedImages.some((img) => img.isCover);
    if (!hasCover && coverImage) {
      const coverUrl = await uploadToS3(coverImage);
      uploadedImages.push({
        url: coverUrl,
        isCover: true,
      });
    }

    if (uploadedImages.length > 0) {
      updateData.images = uploadedImages.map((img) => img.url);
      updateData.coverImage =
        uploadedImages.find((img) => img.isCover)?.url || uploadedImages[0]?.url;
    }

    // Если cover явное null — очистить
    if (coverImage === null) {
      updateData.coverImage = null;
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
