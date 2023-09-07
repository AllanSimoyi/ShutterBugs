import { readFile } from 'fs/promises';

import { prisma } from './db.server';
import { createPasswordHash } from './lib/auth.server';
import { Env } from './lib/environment';

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  secure: true,
  cloud_name: Env.CLOUDINARY_CLOUD_NAME,
  api_key: Env.CLOUDINARY_API_KEY,
  api_secret: Env.CLOUDINARY_API_SECRET,
});

(async () => {
  const hashedPassword = await createPasswordHash('default@7891');
  const chatContent = await readFile('./public/wa/chat.txt', 'utf-8');
  const arr = chatContent.split('\n');
  const relevant = arr.filter((el) => el.includes('IMG'));
  for (const el of relevant) {
    const [date, ...rest] = el.split(' - ');
    const [phone, ...rest2] = rest.join(' ').split(': ');
    const [content] = rest2.join(' ').split(' (');
    if (date === 'zxc') return;
    console.log('phone ->', phone.trim(), 'img ->', content.trim());
    const imageId = await uploadToCloud(`./public/wa/${content.trim()}`);
    const user = await prisma.user
      .findUnique({
        where: { phone },
        select: { id: true },
      })
      .then((user) => {
        if (!user) {
          return prisma.user.create({
            data: {
              phone: phone,
              fullName: phone,
              imageId: '',
              hashedPassword,
            },
          });
        }
        return user;
      });
    await prisma.post.create({
      data: {
        imageId,
        desc: '',
        userId: user.id,
      },
    });
    console.log('Created post for user', user.id, 'with imageId', imageId);
  }
  // console.log(chatContent);
})();

async function uploadToCloud(imagePath: string) {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    });
    console.log(result);
    return result.public_id;
  } catch (error) {
    console.error(error);
  }
}
