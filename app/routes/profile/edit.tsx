import type {
  ActionArgs,
  LinksFunction,
  LoaderArgs,
} from '@remix-run/server-runtime';
import type { CustomActionData, Result } from 'remix-chakra-reusables';

import {
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Heading,
  HStack,
  IconButton,
  Spacer,
  VStack,
} from '@chakra-ui/react';
import { Link, useFetcher, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/server-runtime';
import carouselUrl from 'react-gallery-carousel/dist/index.css';
import {
  ActionContextProvider,
  badRequest,
  CenteredView,
  CustomAlert,
  formResultProps,
  getRawFormFields,
  PrimaryButton,
  processBadRequest,
  TextField,
  UploadState,
  useUploadImage,
} from 'remix-chakra-reusables';
import { Check, X } from 'tabler-icons-react';
import { z } from 'zod';

import {
  CustomCard,
  CustomCatchBoundary,
  CustomErrorBoundary,
} from '~/components/CustomComponents';
import { Toolbar } from '~/components/Toolbar';
import { UpdateProfilePic } from '~/components/UpdateProfilePic';
import { prisma } from '~/db.server';
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

const ImageIdsSchema = z.array(z.string().min(1).max(100));

const Schema = z.object({
  imageIds: z.preprocess((arg) => {
    if (typeof arg === 'string') {
      return JSON.parse(arg);
    }
  }, ImageIdsSchema),
  description: z.string().max(1600),
});

export async function action({ request }: ActionArgs) {
  const currentUserId = await requireUserId(request);
  const fields = await getRawFormFields(request);

  const result = await Schema.safeParseAsync(fields);
  if (!result.success) {
    return processBadRequest(result.error, fields);
  }
  const { imageIds, description } = result.data;

  if (!imageIds.length) {
    return badRequest({
      fields,
      fieldErrors: {
        imageIds: ['Upload at least 1 image'],
      },
      formError: undefined,
    });
  }

  const post = await prisma.post.create({
    data: {
      userId: currentUserId,
      description,
      images: {
        create: imageIds.map((imageId) => ({
          imageId,
        })),
      },
    },
    select: {
      id: true,
    },
  });

  return json({ success: true, data: { postId: post.id } });
}

type Ok = { success: true; postId: string };
type Err = CustomActionData<typeof Schema>;

export default function EditProfile() {
  const currentUser = useUser();

  const { ImageUploadSizeLimit: imageUploadSizeLimit } =
    useLoaderData<typeof loader>();
  const fetcher = useFetcher<Result<Ok, Err>>();

  const profilePic = useUploadImage({
    imageId: currentUser.picId || '',
    uploadState: currentUser.picId ? UploadState.Uploaded : UploadState.Idle,
    imageUploadSizeLimit: {
      value: imageUploadSizeLimit.Value,
      caption: imageUploadSizeLimit.Caption,
    },
  });

  const isProcessing =
    fetcher.state === 'submitting' || fetcher.state === 'loading';

  return (
    <fetcher.Form method="post" style={{ height: '100vh' }}>
      <ActionContextProvider
        {...formResultProps(fetcher.data)}
        isSubmitting={isProcessing}
      >
        <VStack align="stretch" h="100vh">
          <Toolbar
            currentUserName={currentUser.fullName}
            hideSearchOnMobile={true}
          />
          <CenteredView
            flexGrow={1}
            px={{ base: 0, lg: 4 }}
            w={{ base: '100%', md: '60%', lg: '40%' }}
          >
            <CustomCard>
              <CardHeader>
                <HStack justify="center" align="center">
                  <IconButton
                    variant="ghost"
                    as={Link}
                    to={AppLinks.Profile}
                    icon={<X />}
                    aria-label="Cancel"
                  />
                  <Spacer />
                  <Heading size="md">Edit Profile</Heading>
                  <Spacer />
                  <IconButton
                    variant="ghost"
                    type="submit"
                    icon={<Check />}
                    aria-label="Apply Changes"
                  />
                </HStack>
              </CardHeader>
              <Divider />
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <input
                    type="hidden"
                    name="companyImageId"
                    value={profilePic.imageId}
                  />
                  <VStack align="center">
                    <UpdateProfilePic
                      identifier="ProfilePic"
                      fullName={currentUser.fullName}
                      imageId={profilePic.imageId}
                      onChange={profilePic.uploadImage}
                      uploadState={profilePic.uploadState}
                      uploadError={profilePic.uploadError}
                      isProcessing={isProcessing}
                    />
                  </VStack>
                  <TextField name="email" type="email" label="Email Address" />
                  <TextField name="fullName" type="text" label="Full Name" />
                  <TextField name="password" label="Password" type="password" />
                  {!fetcher.data?.success && fetcher.data?.err.formError && (
                    <CustomAlert status={'error'}>
                      {fetcher.data?.err.formError}
                    </CustomAlert>
                  )}
                </VStack>
              </CardBody>
              <CardFooter>
                <VStack w="100%" align="stretch" spacing={4}>
                  <PrimaryButton
                    type="submit"
                    isDisabled={
                      isProcessing ||
                      profilePic.uploadState === UploadState.Uploading
                    }
                  >
                    {profilePic.uploadState === UploadState.Uploading
                      ? 'Uploading Image...'
                      : isProcessing
                      ? 'Applying Changes...'
                      : 'Apply Changes'}
                  </PrimaryButton>
                </VStack>
              </CardFooter>
            </CustomCard>
          </CenteredView>
        </VStack>
      </ActionContextProvider>
    </fetcher.Form>
  );
}

export function CatchBoundary() {
  return <CustomCatchBoundary />;
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <CustomErrorBoundary error={error} />;
}
