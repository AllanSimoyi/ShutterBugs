import { SimpleGrid, VStack } from "@chakra-ui/react";
import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import carouselUrl from 'react-gallery-carousel/dist/index.css';
import { CenteredView, Footer, getRawFormFields, StatusCode } from "remix-chakra-reusables";
import { PostCard } from "~/components/PostCard";
import { Toolbar } from "~/components/Toolbar";
import { prisma } from "~/db.server";
import { PRODUCT_NAME } from "~/lib/constants";
import { flattenFieldErrors, FormActionIdentifier, FormActionSchema, PostCommentSchema, ToggleCommentLikeSchema, TogglePostLikeSchema } from "~/lib/forms.validations";
import { getUserId, requireUserId } from "~/session.server";
import { useOptionalUser } from "~/utils";

export let links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: carouselUrl }
  ]
}

const ITEMS_PER_PAGE = 40;

function fetchPosts (currentUserId: string | undefined) {
  return prisma.post.findMany({
    take: ITEMS_PER_PAGE,
    select: {
      id: true,
      user: {
        select: {
          picId: true,
          fullName: true
        },
      },
      likes: {
        take: 1,
        where: {
          userId: currentUserId,
        },
        select: {
          id: true,
        }
      },
      comments: {
        take: 2,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          user: {
            select: {
              fullName: true,
            }
          },
          content: true,
        }
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        }
      },
      description: true,
      images: {
        select: {
          imageId: true,
        }
      },
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
function getDeveloperLink () {
  const developerLink = process.env.DEVELOPER_WEBSITE_LINK;
  if (!developerLink) {
    throw new Response("Developer website link is missing", { status: StatusCode.NotFound });
  }
  return developerLink;
}
async function refreshPageData (currentUserId: string | undefined) {
  const posts = await fetchPosts(currentUserId);

  const contextualizedPosts = posts.map(post => ({
    ...post,
    likedByCurrentUser: currentUserId ?
      post.likes.length > 0 :
      false,
  }));

  return {
    developerLink: getDeveloperLink(),
    posts: contextualizedPosts,
  }
}

export async function loader ({ request }: LoaderArgs) {
  const currentUserId = await getUserId(request);
  const data = await refreshPageData(currentUserId);
  return json(data);
}

interface FlattenErrorsProps {
  fieldErrors: {
    [x: string]: string[] | undefined;
  },
  formErrors: string[]
}
function flattenErrors (props: FlattenErrorsProps) {
  const { fieldErrors, formErrors } = props;

  const flattenedFieldErrors = fieldErrors ?
    flattenFieldErrors(fieldErrors) :
    "";
  const flattenedFormErrors = formErrors.join(", ");

  return [flattenedFieldErrors, flattenedFormErrors]
    .filter(el => el)
    .join(", ");
}

async function handlePostComment (fields: any, currentUserId: string) {
  const result = await PostCommentSchema.safeParseAsync(fields);
  if (!result.success) {
    const { fieldErrors, formErrors } = result.error.flatten();
    const errorMessage = flattenErrors({ fieldErrors, formErrors });
    return json({ errorMessage });
  }
  const { postId, content } = result.data;

  await prisma.comment.create({
    data: {
      postId,
      userId: currentUserId,
      content,
    }
  });
  return json({ errorMessage: "" });
}

async function handleTogglePostLike (fields: any, currentUserId: string) {
  const result = await TogglePostLikeSchema.safeParseAsync(fields);
  if (!result.success) {
    const { fieldErrors, formErrors } = result.error.flatten();
    const errorMessage = flattenErrors({ fieldErrors, formErrors });
    return json({ errorMessage });
  }
  const { postId } = result.data;

  const currentUserLikes = await prisma.postLike.findMany({
    where: {
      postId,
      userId: currentUserId,
    }
  });
  if (currentUserLikes.length) {
    await Promise.all(
      currentUserLikes.map(currentUserLike => {
        return prisma.postLike.delete({
          where: {
            id: currentUserLike.id,
          }
        });
      })
    );
  } else {
    await prisma.postLike.create({
      data: {
        postId,
        userId: currentUserId,
      }
    });
  }
  return json({ errorMessage: "" });
}

async function handleToggleCommentLike (fields: any, currentUserId: string) {
  const result = await ToggleCommentLikeSchema.safeParseAsync(fields);
  if (!result.success) {
    const { fieldErrors, formErrors } = result.error.flatten();
    const errorMessage = flattenErrors({ fieldErrors, formErrors });
    return json({ errorMessage });
  }
  const { postId } = result.data;

  const currentUserCommentLikes = await prisma.commentLike.findMany({
    where: {
      postId,
      userId: currentUserId,
    }
  });
  if (currentUserCommentLikes.length) {
    await Promise.all(
      currentUserCommentLikes.map(currentUserCommentLike => {
        return prisma.commentLike.delete({
          where: {
            id: currentUserCommentLike.id,
          }
        });
      })
    );
  } else {
    await prisma.commentLike.create({
      data: {
        postId,
        userId: currentUserId,
      }
    });
  }
  return json({ errorMessage: "" });
}

export async function action ({ request }: ActionArgs) {
  const currentUserId = await requireUserId(request);
  const fields = await getRawFormFields(request);

  const result = await FormActionSchema.safeParseAsync(fields);
  if (!result.success) {
    const { fieldErrors, formErrors } = result.error.flatten();
    const errorMessage = flattenErrors({ fieldErrors, formErrors });
    return json({ errorMessage });
  }
  const { _action } = result.data;

  if (_action === FormActionIdentifier.Comment) {
    return handlePostComment(fields, currentUserId);
  }
  if (_action === FormActionIdentifier.TogglePostLike) {
    return handleTogglePostLike(fields, currentUserId);
  }
  if (_action === FormActionIdentifier.ToggleCommentLike) {
    return handleToggleCommentLike(fields, currentUserId);
  }
  return json({ errorMessage: "Invalid form action provided" });
}

export default function Index () {
  const user = useOptionalUser();
  const { developerLink, posts } = useLoaderData<typeof loader>();

  return (
    <VStack align="stretch" minH="100vh">
      <Toolbar currentUserName={user?.fullName || ""} />
      <VStack align="stretch" flexGrow={1} py={8}>
        <CenteredView w={{ base: "100%", md: "60%", lg: "40%" }} px={4}>
          <SimpleGrid columns={{ sm: 1, md: 1, lg: 1 }} spacing={12}>
            {posts.map((post) => (
              <VStack align="stretch" key={post.id}>
                <PostCard
                  currentUserId={user?.id}
                  currentUserFullName={user?.fullName}
                  postId={post.id}
                  userImageId={post.user.picId}
                  userFullName={post.user.fullName}
                  numLikes={post._count.likes}
                  likedByCurrentUser={post.likedByCurrentUser}
                  lastComments={post.comments.map(comment => ({
                    id: comment.id,
                    userFullName: comment.user.fullName,
                    content: comment.content,
                  }))}
                  numComments={post._count.comments}
                  description={post.description}
                  imageIds={post.images.map(image => image.imageId)}
                  createdAt={new Date(post.createdAt)}
                />
              </VStack>
            ))}
          </SimpleGrid>
        </CenteredView>
      </VStack>
      <Footer
        appTitle={PRODUCT_NAME}
        developerName={"Allan Simoyi"}
        developerLink={developerLink}
      />
    </VStack>
  );
}