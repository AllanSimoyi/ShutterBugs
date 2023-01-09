import { faker } from '@faker-js/faker';
import { PrismaClient } from "@prisma/client";
import { createPasswordHash } from "~/lib/auth.server";

const prisma = new PrismaClient();

async function seed () {
  await prisma.commentLike.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.postImage.deleteMany();
  await prisma.postLike.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const Allan = await prisma.user.create({
    data: {
      email: "allansimoyi@gmail.com",
      fullName: "Allan Simoyi",
      picId: "glasses_trubcp",
      hashedPassword: await createPasswordHash("jarnbjorn@7891"),
    },
  });

  const Kudzie = await prisma.user.create({
    data: {
      email: "kudziesimoyi@gmail.com",
      fullName: "Kudzaishe Simoyi",
      picId: "Kudzie_gzmuzx",
      hashedPassword: await createPasswordHash("jarnbjorn@7891"),
    },
  });

  await [...Array(10).keys()]
    .reduce(async (acc, _) => {
      await acc;
      await prisma.post.create({
        data: {
          description: faker.lorem.paragraph(),
          userId: Allan.id,
          images: {
            create: [
              { imageId: "cld-image" },
              { imageId: "cld-image" },
              { imageId: "cld-image" },
            ]
          },
          likes: {
            create: [
              { userId: Kudzie.id },
            ]
          },
          comments: {
            create: [
              { userId: Kudzie.id, content: faker.lorem.sentence() },
              { userId: Allan.id, content: faker.lorem.sentence() },
              { userId: Kudzie.id, content: faker.lorem.sentence() },
              { userId: Allan.id, content: faker.lorem.sentence() },
            ]
          }
        }
      });
    }, Promise.resolve());

  await [...Array(10).keys()]
    .reduce(async (acc, _) => {
      await acc;
      await prisma.post.create({
        data: {
          description: faker.lorem.paragraph(2),
          userId: Kudzie.id,
          images: {
            create: [
              { imageId: "cld-image" },
              { imageId: "cld-image" },
              { imageId: "cld-image" },
            ]
          },
          likes: {
            create: [
              { userId: Allan.id },
            ]
          },
          comments: {
            create: [
              { userId: Kudzie.id, content: faker.lorem.sentence() },
              { userId: Allan.id, content: faker.lorem.sentence() },
              { userId: Kudzie.id, content: faker.lorem.sentence() },
              { userId: Allan.id, content: faker.lorem.sentence() },
            ]
          }
        }
      });
    }, Promise.resolve());

    const posts = await prisma.post.findMany({
      select: {
        id: true,
        userId: true,
      }
    });

    await posts.reduce(async (acc, post) => {
      await acc;
      await prisma.commentLike.create({
        data: {
          postId: post.id,
          userId: post.userId === Allan.id ? Kudzie.id : Allan.id,
        }
      });
    }, Promise.resolve());

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
