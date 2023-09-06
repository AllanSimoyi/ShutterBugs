import type { ActionArgs, LoaderArgs } from '@remix-run/server-runtime';
import type { ChangeEvent } from 'react';

import { fill } from '@cloudinary/url-gen/actions/resize';
import { byRadius } from '@cloudinary/url-gen/actions/roundCorners';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { redirect } from '@remix-run/server-runtime';
import { useCallback, useMemo } from 'react';
import { CloudUpload, LoaderQuarter } from 'tabler-icons-react';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';

import {
  ActionContextProvider,
  useForm,
} from '~/components/ActionContextProvider';
import { RouteErrorBoundary } from '~/components/Boundaries';
import { Breadcrumb } from '~/components/Breadcrumb';
import { CenteredView } from '~/components/CenteredView';
import { useCloudinary } from '~/components/CloudinaryContextProvider';
import { Footer } from '~/components/Footer';
import { InlineAlert } from '~/components/InlineAlert';
import { Toolbar } from '~/components/Toolbar';
import { prisma } from '~/db.server';
import { useUploadImage } from '~/hooks/useUploadImage';
import { UploadState } from '~/lib/cloudinary';
import { badRequest, processBadRequest } from '~/lib/core.validations';
import { getErrorMessage } from '~/lib/errors';
import { getRawFormFields, hasFieldErrors, hasFormError } from '~/lib/forms';
import { inferImageContent } from '~/lib/huggingface.server';
import { AppLinks } from '~/lib/links';
import { requireUser, requireUserId } from '~/session.server';
import { useUser } from '~/utils';

export async function loader({ request }: LoaderArgs) {
  await requireUser(request);
  return null;
}

const Schema = z.object({
  imageId: z.string().min(1).max(100),
});
export async function action({ request }: ActionArgs) {
  const currentUserId = await requireUserId(request);

  try {
    const fields = await getRawFormFields(request);
    const result = Schema.safeParse(fields);
    if (!result.success) {
      return processBadRequest(result.error, fields);
    }
    const { imageId } = result.data;

    const desc = await inferImageContent(imageId);
    await prisma.post.create({
      data: { userId: currentUserId, imageId, desc },
      select: { id: true },
    });

    return redirect(AppLinks.Profile);
  } catch (error) {
    return badRequest({ formError: getErrorMessage(error) });
  }
}

export default function NewPost() {
  const currentUser = useUser();

  useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const { getNameProp, isProcessing } = useForm(fetcher, Schema);
  const { CloudinaryUtil } = useCloudinary();

  const {
    uploadImage,
    imageId,
    error: uploadError,
    uploadState,
  } = useUploadImage('');

  const handleChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        const arr = Array.from(event.target.files);
        if (arr.length) {
          const imageId = await uploadImage(arr[0]);
          if (imageId) {
            fetcher.submit({ imageId }, { method: 'post' });
          }
        }
      }
    },
    [uploadImage, fetcher]
  );

  const error = useMemo(() => {
    if (uploadError) {
      return uploadError;
    }
    if (hasFormError(fetcher.data)) {
      return fetcher.data.formError;
    }
    const imageIdFieldName = getNameProp('imageId').name;
    if (hasFieldErrors(fetcher.data)) {
      const fieldError = fetcher.data.fieldErrors[imageIdFieldName];
      if (fieldError) {
        return fieldError;
      }
    }
  }, [fetcher.data, getNameProp, uploadError]);

  const postImage = useMemo(() => {
    return CloudinaryUtil.image(imageId)
      .resize(fill().aspectRatio('1:1').width(400).height(400))
      .roundCorners(byRadius(5))
      .format('auto')
      .quality('auto')
      .toURL();
  }, [CloudinaryUtil, imageId]);

  return (
    <fetcher.Form method="post" className="flex h-full flex-col items-stretch">
      <ActionContextProvider {...fetcher.data} isSubmitting={isProcessing}>
        <Toolbar currentUserName={currentUser.fullName} hideSearch />
        <CenteredView
          className="grow py-12"
          innerProps={{
            className: twMerge(
              'grow md:w-[60%] lg:w-[40%] px-4 justify-center gap-6'
            ),
          }}
        >
          <input type="hidden" {...getNameProp('imageId')} value={imageId} />
          {hasFormError(fetcher.data) && (
            <InlineAlert>{fetcher.data.formError}</InlineAlert>
          )}
          <Breadcrumb
            items={[
              { link: AppLinks.Profile, label: 'My Photos' },
              'Upload Photo',
            ]}
          />
          <label
            tabIndex={0}
            htmlFor="file"
            className={twMerge(
              'flex cursor-pointer flex-col items-center justify-center gap-6 rounded-xl',
              'border-2 border-dashed border-stone-400 p-12 shadow-xl',
              'hover:scale-[101%] hover:border-stone-800',
              'group transition-all duration-300'
            )}
          >
            {!postImage && uploadState !== UploadState.Uploading && (
              <CloudUpload
                className="animate-bounce text-stone-600 transition-all duration-300 group-hover:text-stone-800"
                size={80}
              />
            )}
            {uploadState === UploadState.Uploading && (
              <LoaderQuarter
                size={80}
                className="animate-spin text-stone-400"
              />
            )}
            {!!postImage && uploadState !== UploadState.Uploading && (
              <img
                src={postImage}
                alt={'New Post'}
                className="rounded-lg object-contain"
              />
            )}
            <span
              className={twMerge(
                'text-center text-xl font-light text-stone-400',
                'transition-all duration-300 group-hover:text-stone-800',
                uploadState === UploadState.Uploaded && 'text-green-600'
              )}
            >
              {uploadState === UploadState.Idle && 'Click To Upload Image'}
              {uploadState === UploadState.Error && 'Something went wrong'}
              {uploadState === UploadState.Uploading && 'Uploading Image...'}
              {uploadState === UploadState.Uploaded && 'Image Uploaded!'}
            </span>
            {!!error && (
              <span className="text-xl font-light text-red-600">{error}</span>
            )}
          </label>
          <input
            id="file"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleChange}
            className="invisible absolute left-0 top-0 opacity-0"
          />
        </CenteredView>
        <Footer />
      </ActionContextProvider>
    </fetcher.Form>
  );
}

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}
