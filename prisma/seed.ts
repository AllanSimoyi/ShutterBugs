import { PrismaClient } from '@prisma/client';

import { createPasswordHash } from '~/lib/auth.server';

const prisma = new PrismaClient();

async function seed() {
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const Allan = await prisma.user.create({
    data: {
      email: 'allansimoyi@gmail.com',
      fullName: 'Allan',
      imageId: 'glasses_trubcp',
      hashedPassword: await createPasswordHash('jarnbjorn@7891'),
    },
  });

  await ['Image_One', 'Two_c11yl7', 'Three_whxzvj', 'Four_u2avvl'].reduce(
    async (acc, imageId) => {
      await acc;
      await prisma.post.create({
        data: {
          userId: Allan.id,
          imageId,
        },
      });
    },
    Promise.resolve()
  );

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
