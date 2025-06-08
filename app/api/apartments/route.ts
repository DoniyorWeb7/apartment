import { authConfig } from '@/app/auth.config';
import { prisma } from '@/prisma/prisma-client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '@/lib/s3Client';
export async function GET() {
  const apartment = await prisma.apartment.findMany({
    include: {
      user: true,
    },
    orderBy: {
      id: 'desc',
    },
  });
  return NextResponse.json(apartment);
}

export async function POST(req: Request) {
  const session = await getServerSession(authConfig);
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: 'Неавторизованный пользователь' }, { status: 401 });
  }

  try {
    const formData = await req.formData();

    // Получаем все файлы с ключом 'images'
    const imagesFiles: File[] = [];
    for (const entry of formData.getAll('images')) {
      if (entry instanceof File) {
        imagesFiles.push(entry);
      }
    }

    if (imagesFiles.length === 0) {
      return NextResponse.json({ error: 'Изображения обязательны' }, { status: 400 });
    }

    if (imagesFiles.length > 10) {
      return NextResponse.json({ error: 'Максимум 10 изображений' }, { status: 400 });
    }

    const coverFile = formData.get('cover') as File | null;

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

    const imageUploadPromises = imagesFiles.map(async (file) => {
      const url = await uploadToS3(file);
      return {
        url,
        isCover: coverFile ? file.name === coverFile.name : false,
      };
    });

    const images = await Promise.all(imageUploadPromises);

    // Проверяем наличие обложки
    const hasCover = images.some((img) => img.isCover);
    if (!hasCover && coverFile) {
      const url = await uploadToS3(coverFile);
      images.push({
        url,
        isCover: true,
      });
    }

    // Парсим остальные данные
    const fields = {
      status: formData.get('status') as string,
      availability: new Date(formData.get('availability') as string),
      price: Number(formData.get('price')),
      district: formData.get('district') as string,
      owner: formData.get('owner') as string,
      adress: formData.get('adress') as string,
      room: Number(formData.get('room')),
      floor: Number(formData.get('floor')),
      floorBuild: Number(formData.get('floorBuild')),
      square: Number(formData.get('square')),
      variant: formData.get('variant') as string,
      description: formData.get('description') as string,
      userId: Number(userId),
    };

    // Создаем квартиру в базе данных
    const newApartment = await prisma.apartment.create({
      data: {
        ...fields,
        images: images.map((img) => img.url),
        coverImage: images.find((img) => img.isCover)?.url || images[0]?.url,
      },
    });

    return NextResponse.json(newApartment);
  } catch (error) {
    console.error('Ошибка при создании квартиры:', error);
    return NextResponse.json({ error: 'Что-то пошло не так' }, { status: 500 });
  }
}
