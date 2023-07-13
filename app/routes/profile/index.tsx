import type { LoaderArgs } from '@remix-run/server-runtime';

import { fill } from '@cloudinary/url-gen/actions/resize';
import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/server-runtime';
import { useCallback } from 'react';
import { Pencil, Share } from 'tabler-icons-react';

import { CenteredView } from '~/components/CenteredView';
import { useCloudinary } from '~/components/CloudinaryContextProvider';
import { PrimaryButtonLink } from '~/components/PrimaryButton';
import { ProfilePic } from '~/components/ProfilePic';
import { SecondaryButton } from '~/components/SecondaryButton';
import { Toolbar } from '~/components/Toolbar';
import { prisma } from '~/db.server';
import { AppLinks } from '~/lib/links';
import { requireUserId } from '~/session.server';
import { useUser } from '~/utils';

export async function loader({ request }: LoaderArgs) {
  const currentUserId = await requireUserId(request);

  const posts = await prisma.post.findMany({
    where: { userId: currentUserId },
    select: { id: true, imageId: true },
  });

  return json({ posts });
}

export default function ProfilePage() {
  const currentUser = useUser();
  const { posts } = useLoaderData<typeof loader>();

  const { CloudinaryUtil } = useCloudinary();

  const getImageUrl = useCallback(
    (imageId: string) =>
      CloudinaryUtil.image(imageId)
        .resize(fill().aspectRatio('1:1'))
        .format('auto')
        .quality('auto')
        .toURL(),
    [CloudinaryUtil]
  );

  return (
    <div className="flex min-h-full flex-col items-stretch">
      <Toolbar currentUserName={currentUser.fullName || ''} />
      <CenteredView className="grow items-stretch p-4">
        <div className="flex flex-col items-center justify-center gap-2 py-4">
          <ProfilePic
            imageId={currentUser.imageId}
            fullName={currentUser.fullName}
          />
          <div className="flex flex-col items-center justify-center gap-0">
            <span className="text-2xl font-semibold">
              {currentUser.fullName}
            </span>
            <span className="text-sm">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            </span>
          </div>
          <div className="flex flex-row items-center justify-center gap-4 py-4">
            <PrimaryButtonLink
              to={AppLinks.EditProfile}
              aria-label="Edit Profile"
            >
              <Pencil />
              Edit
            </PrimaryButtonLink>
            <SecondaryButton aria-label="Share Profile">
              <Share />
              Share
            </SecondaryButton>
          </div>
        </div>
        <div className="flex flex-col items-stretch py-6">
          <div className="grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-6">
            {posts.map((post) => (
              <img
                key={post.id}
                alt={'Post'}
                className="h-auto w-full object-cover transition-all duration-300 hover:scale-105"
                src={getImageUrl(post.imageId)}
              />
            ))}
          </div>
        </div>
      </CenteredView>
    </div>
  );
}
