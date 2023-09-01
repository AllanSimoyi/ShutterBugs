import { byRadius } from '@cloudinary/url-gen/actions/roundCorners';
import { Response, json, type LoaderArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import dayjs from 'dayjs';
import { useMemo } from 'react';

import { CenteredView } from '~/components/CenteredView';
import { useCloudinary } from '~/components/CloudinaryContextProvider';
import { Footer } from '~/components/Footer';
import { Toolbar } from '~/components/Toolbar';
import { prisma } from '~/db.server';
import { PRODUCT_NAME } from '~/lib/constants';
import { StatusCode, getValidatedId } from '~/lib/core.validations';
import { useOptionalUser } from '~/utils';

export async function loader({ request, params }: LoaderArgs) {
  const id = getValidatedId(params.id);

  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      imageId: true,
      createdAt: true,
      user: { select: { id: true, imageId: true, fullName: true } },
    },
  });
  if (!post) {
    throw new Response('Post not found', { status: StatusCode.NotFound });
  }

  return json({
    post: { ...post, createdAt: dayjs(post.createdAt).fromNow() },
  });
}

export default function Id() {
  const user = useOptionalUser();
  const { post } = useLoaderData<typeof loader>();

  const { CloudinaryUtil } = useCloudinary();

  const postImage = useMemo(() => {
    return CloudinaryUtil.image(post.imageId)
      .roundCorners(byRadius(5))
      .format('auto')
      .quality('auto')
      .toURL();
  }, [CloudinaryUtil, post.imageId]);

  return (
    <div className="flex min-h-full flex-col items-stretch">
      <Toolbar currentUserName={user?.fullName || ''} />
      <div className="flex grow flex-col items-stretch py-12">
        <CenteredView className="px-2">
          <img
            src={postImage}
            alt="Post"
            className="max-h-screen object-contain"
          />
        </CenteredView>
      </div>
      <Footer appTitle={PRODUCT_NAME} />
    </div>
  );
}
