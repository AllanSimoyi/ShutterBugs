import type {
  ActionArgs,
  LinksFunction,
  LoaderArgs,
} from '@remix-run/server-runtime';

import { useFetcher, useLoaderData, useNavigate } from '@remix-run/react';
import { json } from '@remix-run/server-runtime';
import { useEffect, useMemo } from 'react';
import carouselUrl from 'react-gallery-carousel/dist/index.css';
import { z } from 'zod';

import { ActionContextProvider } from '~/components/ActionContextProvider';
import { RouteErrorBoundary } from '~/components/Boundaries';
import { CenteredView } from '~/components/CenteredView';
import { Done } from '~/components/Done';
import { InlineAlert } from '~/components/InlineAlert';
import { Posting } from '~/components/Posting';
import { Toolbar } from '~/components/Toolbar';
import { UploadImages } from '~/components/UploadImages';
import { prisma } from '~/db.server';
import { useUploadImage } from '~/hooks/useUploadImage';
import { processBadRequest } from '~/lib/core.validations';
import { getRawFormFields, hasFormError } from '~/lib/forms';
import { AppLinks } from '~/lib/links';
import { ImageUploadSizeLimit } from '~/lib/post.server';
import { requireUser, requireUserId } from '~/session.server';
import { useUser } from '~/utils';

export let links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: carouselUrl }];
};

export async function loader({ request }: LoaderArgs) {
  await requireUser(request);
  return json({ ImageUploadSizeLimit });
}

const Schema = z.object({
  imageId: z.string().min(1).max(100),
});

export async function action({ request }: ActionArgs) {
  const currentUserId = await requireUserId(request);

  const fields = await getRawFormFields(request);
  const result = Schema.safeParse(fields);
  if (!result.success) {
    return processBadRequest(result.error, fields);
  }
  const { imageId } = result.data;

  const post = await prisma.post.create({
    data: {
      userId: currentUserId,
      imageId,
    },
    select: { id: true },
  });

  return json({ postId: post.id });
}

export default function NewPost() {
  const currentUser = useUser();

  const { ImageUploadSizeLimit } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  const navigate = useNavigate();

  const imageUploadTools = useUploadImage({
    imageId: '',
    ImageUploadSizeLimit,
  });

  const isPosting = fetcher.state !== 'idle';

  const postId = useMemo(() => {
    const result = z.object({ postId: z.string() }).safeParse(fetcher.data);
    if (!result.success) {
      return undefined;
    }
    return result.data.postId;
  }, [fetcher.data]);

  useEffect(() => {
    if (postId) {
      setTimeout(() => navigate(AppLinks.Home), 2500);
    }
  }, [postId, navigate]);

  return (
    <fetcher.Form method="post" style={{ height: '100vh' }}>
      <ActionContextProvider {...fetcher.data} isSubmitting={isPosting}>
        <div className="flex h-full flex-col items-stretch">
          <Toolbar currentUserName={currentUser.fullName} />
          <CenteredView className="w-full grow px-0 md:w-[60%] lg:w-[40%] lg:px-4">
            <div className="flex grow flex-col items-stretch gap-0 overflow-hidden rounded-md bg-white/50 shadow-md backdrop-blur-sm">
              <div className="flex flex-row items-center justify-center px-0 py-4">
                <h3 className="text-lg font-semibold">
                  {!isPosting && !postId && 'Upload Image'}
                  {isPosting && 'Posting...'}
                  {!!postId && 'Upload Done'}
                </h3>
              </div>
              <div className="grow" />
              <div className="flex grow flex-col items-stretch">
                <input
                  type="hidden"
                  name="imageId"
                  value={imageUploadTools.imageId}
                />
                {isPosting && <Posting />}
                {!!postId && <Done />}
                {hasFormError(fetcher.data) && (
                  <InlineAlert>{fetcher.data.formError}</InlineAlert>
                )}
                <UploadImages {...imageUploadTools} />
              </div>
            </div>
          </CenteredView>
        </div>
      </ActionContextProvider>
    </fetcher.Form>
  );
}

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}
