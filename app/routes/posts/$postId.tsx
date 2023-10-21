import { Response, json, type LoaderArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { twMerge } from 'tailwind-merge';

import { CenteredView } from '~/components/CenteredView';
import { Desc } from '~/components/Desc';
import { Footer } from '~/components/Footer';
import { Owner } from '~/components/Owner';
import { Toolbar } from '~/components/Toolbar';
import { prisma } from '~/db.server';
import { useFullImage } from '~/hooks/useFullImage';
import { StatusCode, getValidatedId } from '~/lib/core.validations';
import { useOptionalUser } from '~/utils';

dayjs.extend(relativeTime);

export async function loader({ request, params }: LoaderArgs) {
  const id = getValidatedId(params.postId);
  const post = await prisma.post
    .findUnique({
      where: { id },
      select: {
        id: true,
        imageId: true,
        desc: true,
        createdAt: true,
        user: { select: { id: true, imageId: true, fullName: true } },
      },
    })
    .then((post) => {
      if (!post) {
        return undefined;
      }
      return { ...post, createdAt: dayjs(post.createdAt).fromNow() };
    });
  if (!post) {
    throw new Response('Post not found', { status: StatusCode.NotFound });
  }
  return json({ post });
}

export default function PostId() {
  const user = useOptionalUser();
  const { post } = useLoaderData<typeof loader>();
  const imageUrl = useFullImage(post.imageId);
  return (
    <div className="flex min-h-full flex-col items-stretch">
      <Toolbar hideSearch currentUserName={user?.fullName || ''} />
      <div className="flex grow flex-col items-stretch py-12">
        <CenteredView
          className="px-2"
          innerProps={{ className: twMerge('gap-6') }}
        >
          <img src={imageUrl} alt={post.desc || ''} className="rounded-lg" />
          <Owner
            {...post.user}
            createdAt={post.createdAt}
            className="text-stone-800"
          />
          {!!post.desc && (
            <div className="flex flex-col items-start">
              <Desc className="bg-stone-200 text-stone-800">{post.desc}</Desc>
            </div>
          )}
        </CenteredView>
      </div>
      <Footer />
    </div>
  );
}
