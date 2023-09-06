import type { LoaderArgs } from '@remix-run/node';

import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/server-runtime';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { Catalog } from '~/components/Catalog';
import { CenteredView } from '~/components/CenteredView';
import { Footer } from '~/components/Footer';
import { Toolbar } from '~/components/Toolbar';
import { prisma } from '~/db.server';
import { useOptionalUser } from '~/utils';

dayjs.extend(relativeTime);

const ITEMS_PER_PAGE = 500;

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
      return posts.map(({ id: postId, user: owner, ...post }) => ({
        ...post,
        postId,
        owner,
        desc: post.desc || '',
        createdAt: dayjs(post.createdAt).fromNow(),
      }));
    });
  return json({ posts });
}

export default function Index() {
  const user = useOptionalUser();
  const { posts } = useLoaderData<typeof loader>();

  return (
    <div className="flex min-h-full flex-col items-stretch">
      <Toolbar currentUserName={user?.fullName || ''} />
      <div className="flex grow flex-col items-stretch py-12">
        <CenteredView className="px-2">
          <Catalog
            posts={posts.map((post) => ({ ...post, onSelect: () => {} }))}
          />
        </CenteredView>
      </div>
      <Footer />
    </div>
  );
}
