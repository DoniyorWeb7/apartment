import { hashSync } from 'bcrypt';
import { prisma } from './prisma-client';

async function up() {
  await prisma.user.createMany({
    data: [
      {
        fullName: 'Doniyor Yusupov',
        username: 'doniy',
        phone: '+998945999948',
        passport: 'FA4444445',
        availabilityPas: new Date('2025-06-01'),
        password: hashSync('111111', 10),
        role: 'USER',
      },
      {
        fullName: 'Yusu',
        username: 'usp',
        phone: '+998945999948',
        passport: 'FA4444445',
        availabilityPas: new Date('2025-06-01'),
        password: hashSync('2222222', 10),
        role: 'USER',
      },
      {
        fullName: 'Aziz',
        username: 'az',
        phone: '+998945999948',
        passport: 'FA4444445',
        availabilityPas: new Date('2025-06-01'),
        password: hashSync('333333', 10),
        role: 'USER',
      },
      {
        fullName: 'Doniyor',
        username: 'Doni',
        phone: '+998945999948',
        passport: 'FA4444445',
        availabilityPas: new Date('2025-06-01'),
        password: hashSync('2222222', 10),
        role: 'ADMIN',
      },
    ],
  });
}

async function down() {
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
}

async function main() {
  try {
    await down();
    await up();
  } catch (error) {
    console.error(error);
  }
}

main().then(async () => {
  await prisma.$disconnect();
});
