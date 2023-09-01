import { prisma } from './db.server';
import { inferImageContent } from './lib/huggingface.server';

(async () => {
  console.log('Fetching posts...');
  await prisma.post
    .findMany({ select: { id: true, imageId: true, desc: true } })
    .then(async (posts) => {
      console.log('Fetched', posts.length, 'posts');
      for (let post of posts) {
        console.log('Infering image content for post', post.id);
        const desc = await inferImageContent(post.imageId);
        console.log(
          'Inferred image content for post',
          post.id,
          ':',
          desc || 'No description found'
        );
        if (desc) {
          console.log("Updating post's description...");
          await prisma.post.update({
            where: { id: post.id },
            data: { desc },
          });
          console.log("Updated post's description");
        }
      }
    });
})();
