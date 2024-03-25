import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const timestamp = new Date('2023-01-01T00:00:00Z');
  await prisma.message.create({
    data: {
      createdAt: timestamp,
      content: 'Hello, World!',
    },
  });

  // Got the messages with `findMany`
  const messages = await prisma.message.findMany({
    where: {
      createdAt: timestamp,
    },
  });

  console.log('Find with findMany:', messages);

  // Got nothing with `$queryRaw`
  const messages2 = await prisma.$queryRaw`SELECT *
  FROM "Message" m
  WHERE m.created_at = ${timestamp};`;
  console.log('Find with $queryRaw:', messages2);
}


main().catch(console.error);