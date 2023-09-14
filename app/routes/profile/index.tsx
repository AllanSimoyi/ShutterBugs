import type { LoaderArgs } from '@remix-run/server-runtime';

import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/server-runtime';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { twMerge } from 'tailwind-merge';

import { Catalog } from '~/components/Catalog';
import { CenteredView } from '~/components/CenteredView';
import { ProfilePic } from '~/components/ProfilePic';
import { Toolbar } from '~/components/Toolbar';
import { prisma } from '~/db.server';
import { requireUserId } from '~/session.server';
import { useUser } from '~/utils';

dayjs.extend(relativeTime);

export async function loader({ request }: LoaderArgs) {
  const currentUserId = await requireUserId(request);

  const posts = await prisma.post
    .findMany({
      where: { userId: currentUserId },
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
      return posts.map(({ id: postId, desc, user, ...post }) => ({
        ...post,
        postId,
        desc: desc || '',
        owner: user,
        createdAt: dayjs(post.createdAt).fromNow(),
      }));
    });

  return json({ posts });
}

export default function ProfilePage() {
  const currentUser = useUser();
  const { posts } = useLoaderData<typeof loader>();

  return (
    <div className="flex min-h-full flex-col items-stretch">
      <Toolbar currentUserName={currentUser.fullName || ''} />
      <CenteredView
        className="grow p-4"
        innerProps={{
          className: twMerge('border-2 border-stone-200 rounded-lg shadow-xl'),
        }}
      >
        <div className="flex h-[150px] flex-col items-stretch rounded-t-lg border-b-2 border-stone-200 bg-stone-100 shadow" />
        <div className="flex -translate-y-24 flex-col items-start gap-6 p-6">
          <ProfilePic
            imageId={currentUser.imageId}
            fullName={currentUser.fullName}
          />
          <div className="flex flex-col items-start gap-0">
            <span className="text-2xl font-normal">{currentUser.fullName}</span>
            <span className="text-base font-light">
              {posts.length} {posts.length === 1 ? 'photo' : 'photos'}
            </span>
          </div>
          <Catalog posts={posts} />
        </div>
      </CenteredView>
    </div>
  );
}
