import { Divider, Heading, HStack, IconButton, Spacer, useColorMode, useToast, VStack } from "@chakra-ui/react";
import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import type { ActionArgs, LinksFunction, LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { useCallback, useEffect, useMemo, useState } from "react";
import carouselUrl from 'react-gallery-carousel/dist/index.css';
import type { CustomActionData, Result } from "remix-chakra-reusables";
import { ActionContextProvider, badRequest, CenteredView, formResultProps, getRawFormFields, processBadRequest } from "remix-chakra-reusables";
import { ArrowNarrowLeft, ArrowNarrowRight, Check } from "tabler-icons-react";
import { z } from "zod";
import { CustomCatchBoundary, CustomErrorBoundary } from '~/components/CustomComponents';
import { Done } from "~/components/Done";
import { ImageUploadMetaData } from "~/components/ImageUploadMetaData";
import { Posting } from "~/components/Posting";
import { Toolbar } from "~/components/Toolbar";
import { UploadImages } from "~/components/UploadImages";
import { prisma } from "~/db.server";
import { useUploadImages } from "~/hooks/useUploadImages";
import { AppLinks } from "~/lib/links";
import { requireUser, requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export let links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: carouselUrl }
  ]
}

export async function loader ({ request }: LoaderArgs) {
  await requireUser(request);
  return json({});
}

const ImageIdsSchema = z.array(z.string().min(1).max(100));

const Schema = z.object({
  imageIds: z.preprocess((arg) => {
    if (typeof arg === "string") {
      return JSON.parse(arg)
    }
  }, ImageIdsSchema),
  description: z.string().max(1600),
});

export async function action ({ request }: ActionArgs) {
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
        imageIds: ["Upload at least 1 image"],
      },
      formError: undefined,
    });
  }

  const post = await prisma.post.create({
    data: {
      userId: currentUserId,
      description,
      images: {
        create: imageIds.map(imageId => ({
          imageId,
        })),
      }
    },
    select: {
      id: true,
    }
  });

  return json({ success: true, data: { postId: post.id } });
}

enum Screen {
  Images = "Images",
  MetaData = "MetaData",
}

type Ok = { success: true, postId: string };
type Err = CustomActionData<typeof Schema>;

export default function NewPost () {
  const currentUser = useUser();

  useLoaderData();
  const fetcher = useFetcher<Result<Ok, Err>>();

  const toast = useToast();
  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Images);

  const imageUploadTools = useUploadImages({
    imageIds: [],
  });

  const previousIsDisabled = useMemo(() => {
    return currentScreen === Screen.Images;
  }, [currentScreen]);

  const handlePreviousClick = useCallback(() => {
    setCurrentScreen(prevState => {
      if (prevState === Screen.MetaData) {
        return Screen.Images;
      }
      return prevState;
    })
  }, []);

  const handleNextClick = useCallback(() => {
    if (currentScreen === Screen.Images) {
      setCurrentScreen(Screen.MetaData);
    }
  }, [currentScreen]);

  const isPosting = fetcher.state === "submitting" ||
    fetcher.state === "loading";

  const isDone = fetcher.data?.success;
  const postId = fetcher.data?.success ?
    fetcher.data.data.postId :
    undefined;

  useEffect(() => {
    if (!fetcher.data?.success && fetcher.data?.err.formError) {
      toast({
        title: fetcher.data?.err.formError,
        status: "error",
        isClosable: true,
      });
    }
  }, [toast, fetcher.data]);

  useEffect(() => {
    if (
      !fetcher.data?.success &&
      (
        fetcher.data?.err.fieldErrors?.imageIds ||
        fetcher.data?.err.fieldErrors?.description
      )
    ) {
      setCurrentScreen(Screen.Images);
    }
  }, [toast, fetcher.data]);

  useEffect(() => {
    if (postId) {
      setTimeout(() => {
        return navigate(AppLinks.Post(postId));
      }, 2500);
    }
  }, [postId, navigate]);

  return (
    <fetcher.Form method="post" style={{ height: "100vh" }}>
      <ActionContextProvider {...formResultProps(fetcher.data)} isSubmitting={isPosting}>
        <VStack align="stretch" h="100vh">
          <Toolbar
            currentUserName={currentUser.fullName}
            hideSearchOnMobile={true}
          />
          <CenteredView
            flexGrow={1}
            px={{ base: 0, lg: 4 }}
            w={{ base: "100%", md: "60%", lg: "40%" }}
          >
            <VStack
              flexGrow={1}
              shadow="md"
              spacing={0}
              align="stretch"
              borderRadius={10}
              overflow="hidden"
              backdropFilter="saturate(180%) blur(5px)"
              bgColor={colorMode === "light" ? "white" : "whiteAlpha.200"}
            >
              <HStack justify="center" align="center" py={4} px={0}>
                <IconButton
                  size={{ base: "lg", lg: "sm" }}
                  variant="ghost"
                  borderRadius={10}
                  icon={<ArrowNarrowLeft />}
                  aria-label="Previous Screen"
                  onClick={handlePreviousClick}
                  visibility={previousIsDisabled ? "hidden" : "visible"}
                />
                <Spacer />
                <Heading size='md'>
                  {!isPosting && !isDone && (
                    <>
                      {currentScreen === Screen.Images && "Select Images"}
                      {currentScreen === Screen.MetaData && "Details"}
                    </>
                  )}
                  {isPosting && "Posting..."}
                  {isDone && "Upload Done"}
                </Heading>
                <Spacer />
                {currentScreen !== Screen.MetaData && (
                  <IconButton
                    size={{ base: "lg", lg: "sm" }}
                    variant="ghost"
                    borderRadius={10}
                    aria-label="Next Screen"
                    onClick={handleNextClick}
                    icon={<ArrowNarrowRight />}
                  />
                )}
                {currentScreen === Screen.MetaData && (
                  <IconButton
                    size={{ base: "lg", lg: "sm" }}
                    type="submit"
                    variant="ghost"
                    borderRadius={10}
                    aria-label="Create Post"
                    icon={<Check />}
                  />
                )}
              </HStack>
              <Divider />
              <VStack align="stretch" flexGrow={1}>
                <input
                  type="hidden"
                  name="imageIds"
                  value={JSON.stringify(imageUploadTools.imageUploads.map(imageUpload => imageUpload.imageId))}
                />
                {currentScreen === Screen.Images && (
                  <UploadImages {...imageUploadTools} />
                )}
                {currentScreen === Screen.MetaData && (
                  <ImageUploadMetaData />
                )}
                {isPosting && (
                  <Posting />
                )}
                {isDone && (
                  <Done />
                )}
              </VStack>
            </VStack>
          </CenteredView>
        </VStack>
      </ActionContextProvider>
    </fetcher.Form>
  )
}

export function CatchBoundary () {
  return <CustomCatchBoundary />
}

export function ErrorBoundary ({ error }: { error: Error }) {
  return <CustomErrorBoundary error={error} />
}