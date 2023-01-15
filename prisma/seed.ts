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
      fullName: "Allan",
      picId: "glasses_trubcp",
      hashedPassword: await createPasswordHash("jarnbjorn@7891"),
    },
  });

  const Kudzie = await prisma.user.create({
    data: {
      email: "kudziesimoyi@gmail.com",
      fullName: "Kudzie",
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
              { imageId: "Image_One" },
              { imageId: "Two_c11yl7" },
              { imageId: "Three_whxzvj" },
              { imageId: "Four_u2avvl" },
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
              { imageId: "Image_One" },
              { imageId: "Two_c11yl7" },
              { imageId: "Three_whxzvj" },
              { imageId: "Four_u2avvl" },
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
      comments: {
        select: {
          id: true,
        }
      }
    }
  });

  const commentIds = posts
    .map(post => post.comments)
    .map(comments => comments.map(comment => comment.id))
    .reduce((acc, commentIds) => {
      return [
        ...acc,
        ...commentIds
      ]
    }, []);

  await commentIds.reduce(async (acc, commentId) => {
    await acc;
    await prisma.commentLike.create({
      data: {
        commentId: commentId,
        userId: Kudzie.id,
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
