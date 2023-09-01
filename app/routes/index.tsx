import type { LinksFunction, LoaderArgs } from '@remix-run/node';

import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/server-runtime';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useCallback, useState } from 'react';
import carouselUrl from 'react-gallery-carousel/dist/index.css';

import { CenteredView } from '~/components/CenteredView';
import { Footer } from '~/components/Footer';
import { FullScreenImage } from '~/components/FullScreenImage';
import { PostCard } from '~/components/PostCard';
import { Toolbar } from '~/components/Toolbar';
import { prisma } from '~/db.server';
import { PRODUCT_NAME } from '~/lib/constants';
import { useOptionalUser } from '~/utils';

dayjs.extend(relativeTime);

export let links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: carouselUrl }];
};

const ITEMS_PER_PAGE = 10;

export async function loader(_: LoaderArgs) {
  const posts = await prisma.post
    .findMany({
      take: ITEMS_PER_PAGE,
      select: {
        id: true,
        imageId: true,
        desc: true,
        createdAt: true,
        user: { select: { id: true, imageId: true, fullName: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    .then((posts) => {
      return posts.map((post) => ({
        ...post,
        createdAt: dayjs(post.createdAt).fromNow(),
      }));
    });
  return json({ posts });
}

interface SelectedImage {
  imageId: string;
}

export default function Index() {
  const user = useOptionalUser();
  const { posts } = useLoaderData<typeof loader>();

  const [selectedImage, setSelectedImage] = useState<SelectedImage | undefined>(
    undefined
  );

  const openFullScreenImage = useCallback((post: SelectedImage) => {
    setSelectedImage(post);
  }, []);

  const closeFullScreenImage = useCallback(() => {
    setSelectedImage(undefined);
  }, []);

  return (
    <div className="flex min-h-full flex-col items-stretch">
      <Toolbar currentUserName={user?.fullName || ''} />
      <FullScreenImage post={selectedImage} close={closeFullScreenImage} />
      <div className="flex grow flex-col items-stretch py-12">
        <CenteredView className="px-2">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <div key={post.id} className="flex flex-col items-stretch">
                <PostCard
                  postId={post.id}
                  imageId={post.imageId}
                  description={post.desc || ''}
                  createdAt={post.createdAt}
                  owner={{
                    id: post.user.id,
                    imageId: post.user.imageId,
                    name: post.user.fullName,
                  }}
                  onSelect={() =>
                    openFullScreenImage({ imageId: post.imageId })
                  }
                />
              </div>
            ))}
          </div>
        </CenteredView>
      </div>
      <Footer appTitle={PRODUCT_NAME} />
    </div>
  );
}
