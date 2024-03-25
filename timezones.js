import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Insert some messages with different timestamps
async function setupStubData() {
  const messages = [];
  for (let i = -12; i < 15; i++) {
    const date = new Date('2024-01-01T00:00:00Z');
    date.setHours(date.getHours() + i);
    messages.push({
      createdAt: date,
      content: `Message at UTC ${i}:00`,
    })
  }
  await prisma.message.createMany({
    data: messages,
  });
}


async function main() {
  if (!await prisma.message.count()) {
    await setupStubData();
  }

  console.log('All messages:')
  console.table(await prisma.message.findMany());

  const timestamp = new Date('2024-01-01T00:00:00Z');

  // Try to find a message at UTC 00:00
  const result = await prisma.$queryRaw`SELECT *
  FROM "Message" m
  WHERE m.created_at = ${timestamp};`;

  // Expected result: Message at UTC 0:00
  // Actual result: Other message depending on the timezone of the database
  console.log('Result of finding message at UTC 00:00');
  console.table(result);

  console.log('Node.js Timezone:', new Date().toString().match(/([A-Z]+[\+-][0-9]+)/)[0]);
  console.log('Node.js TZ:', Intl.DateTimeFormat().resolvedOptions().timeZone);
  console.log('Node.js TimezoneOffset:', new Date().getTimezoneOffset());
}


main().catch(console.error);