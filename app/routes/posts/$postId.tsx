import carouselUrl from 'react-gallery-carousel/dist/index.css';
import { HStack, VStack } from "@chakra-ui/react";
import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { CenteredView, Footer, RecordIdSchema, StatusCode } from "remix-chakra-reusables";
import { ExpandedPostCard } from "~/components/ExpandedPostCard";
import { Toolbar } from "~/components/Toolbar";
import { prisma } from "~/db.server";
import { PRODUCT_NAME } from "~/lib/constants";
import { getUserId } from "~/session.server";
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
function getDeveloperLink () {
  const developerLink = process.env.DEVELOPER_WEBSITE_LINK;
  if (!developerLink) {
    throw new Response("Developer website link is missing", { status: StatusCode.NotFound });
  }
  return developerLink;
}
async function getPageData (postId: string, currentUserId: string | undefined) {
  const post = await fetchPost(postId, currentUserId);
  if (!post) {
    throw new Response("Post not found, it's likely been removed by the owner", { status: StatusCode.NotFound });
  }

  return {
    developerLink: getDeveloperLink(),
    post: {
      ...post,
      likedByCurrentUser: currentUserId ?
        post.likes.length > 0 :
        false,
      comments: post.comments.map(comment => ({
        ...comment,
        createdAt: dayjs(comment.createdAt),
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


export default function PostComponent () {
  const user = useOptionalUser();
  const { developerLink, post } = useLoaderData<typeof loader>();

  return (
    <VStack align="stretch" h="100vh">
      <Toolbar currentUserName={user?.fullName || ""} />
      <CenteredView align="stretch" flexGrow={1} overflowY="hidden" innerProps={{ h: "100%" }} p={4}>
        {/* <HStack align="stretch">
        </HStack> */}
        <ExpandedPostCard
          currentUserId={user?.id}
          currentUserFullName={user?.fullName}
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
            createdAt: comment.createdAt,
          }))}
          description={post.description}
          imageIds={post.images.map(image => image.imageId)}
          createdAt={post.createdAt}
        />
      </CenteredView>
      <Footer
        appTitle={PRODUCT_NAME}
        developerName={"Allan Simoyi"}
        developerLink={developerLink}
      />
    </VStack>
  )
}