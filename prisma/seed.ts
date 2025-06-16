import { prisma } from './prisma-client';

async function up() {}

async function down() {
  await prisma.$executeRaw`TRUNCATE TABLE "Apartment" RESTART IDENTITY CASCADE`;
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
