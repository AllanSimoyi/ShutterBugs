import { VStack } from "@chakra-ui/react";
import type { ActionArgs, LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import carouselUrl from 'react-gallery-carousel/dist/index.css';
import { CenteredView, getRawFormFields, RecordIdSchema, StatusCode } from "remix-chakra-reusables";
import { ExpandedPostCard } from "~/components/ExpandedPostCard";
import { Toolbar } from "~/components/Toolbar";
import { prisma } from "~/db.server";
import { FormActionIdentifier, FormActionSchema } from "~/lib/forms.validations";
import { flattenErrors, handlePostComment, handleToggleCommentLike, handleTogglePostLike } from "~/lib/posts";
import { getUserId, requireUserId } from "~/session.server";
import { useOptionalUser } from "~/utils";

dayjs.extend(relativeTime);

export let links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: carouselUrl }
  ]
}

function fetchPost (postId: string, currentUserId: string | undefined) {
  return prisma.post.findUnique({
    where: {
      id: postId,
    },
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
        take: 50,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          user: {
            select: {
              picId: true,
              fullName: true,
            }
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
          _count: {
            select: {
              likes: true,
            },
          },
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
  });
}
async function getPageData (postId: string, currentUserId: string | undefined) {
  const post = await fetchPost(postId, currentUserId);
  if (!post) {
    throw new Response("Post not found, it's likely been removed by the owner", { status: StatusCode.NotFound });
  }

  return {
    post: {
      ...post,
      likedByCurrentUser: currentUserId ?
        post.likes.length > 0 :
        false,
      comments: post.comments.map(comment => ({
        ...comment,
        likedByCurrentUser: currentUserId ?
          comment.likes.length > 0 :
          false,
        createdAt: dayjs(comment.createdAt).fromNow(),
      })),
      createdAt: dayjs(post.createdAt).fromNow(),
    }
  }
}

export async function loader ({ request, params }: LoaderArgs) {
  const currentUserId = await getUserId(request);

  const result = RecordIdSchema.safeParse(params.postId);
  if (!result.success) {
    throw new Response("Invalid post ID provided", { status: StatusCode.BadRequest });
  }
  const postId = result.data;

  const data = await getPageData(postId, currentUserId);
  return json(data);
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

export default function PostComponent () {
  const user = useOptionalUser();
  const { post } = useLoaderData<typeof loader>();

  return (
    <VStack align="stretch" h="100vh">
      <Toolbar
        currentUserName={user?.fullName || ""}
        hideSearchOnMobile={true}
      />
      <CenteredView
        align="stretch"
        flexGrow={1}
        overflowY="hidden"
        innerProps={{ h: "100%" }}
        p={4}
      >
        <ExpandedPostCard
          currentUserId={user?.id}
          currentUserFullName={user?.fullName}
          currentUserImageId={user?.picId}
          postId={post.id}
          userImageId={post.user.picId}
          userFullName={post.user.fullName}
          numLikes={post._count.likes}
          likedByCurrentUser={post.likedByCurrentUser}
          comments={post.comments.map(comment => ({
            id: comment.id,
            userImageId: comment.user.picId,
            userFullName: comment.user.fullName,
            content: comment.content,
            numLikes: comment._count.likes,
            likedByCurrentUser: comment.likedByCurrentUser,
            createdAt: comment.createdAt,
          }))}
          description={post.description}
          imageIds={post.images.map(image => image.imageId)}
          createdAt={post.createdAt}
        />
      </CenteredView>
    </VStack>
  )
}