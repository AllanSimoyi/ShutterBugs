import { SimpleGrid, VStack } from "@chakra-ui/react";
import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import carouselUrl from 'react-gallery-carousel/dist/index.css';
import { Footer, StatusCode } from "remix-chakra-reusables";
import { FeedCenteredView } from "~/components/CustomComponents";
import { PostCard } from "~/components/PostCard";
import { Toolbar } from "~/components/Toolbar";
import { prisma } from "~/db.server";
import { PRODUCT_NAME } from "~/lib/constants";
import { useOptionalUser } from "~/utils";

export let links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: carouselUrl }
  ]
}

export async function loader (_: LoaderArgs) {
  const developerLink = process.env.DEVELOPER_WEBSITE_LINK;
  if (!developerLink) {
    throw new Response("Developer website link is missing", { status: StatusCode.NotFound });
  }

  const posts = await prisma.post.findMany({
    select: {
      id: true,
      user: {
        select: {
          picId: true,
          fullName: true
        },
      },
      _count: {
        select: {
          likes: true,
        }
      },
      description: true,
      images: {
        select: {
          imageId: true,
        }
      },
      createdAt: true,
    }
  });

  return json({ developerLink, posts });
}

export default function Index () {
  const user = useOptionalUser();
  const { developerLink, posts } = useLoaderData<typeof loader>();

  return (
    <VStack align="stretch" minH="100vh">
      <Toolbar currentUserName={user?.fullName || ""} />
      <VStack align="stretch" flexGrow={1} py={8}>
        <FeedCenteredView px={4}>
          <SimpleGrid columns={{ sm: 1, md: 1, lg: 1 }} spacing={6}>
            {posts.map((post) => (
              <VStack align="stretch" key={post.id}>
                <PostCard
                  currentUserId={user?.id}
                  postId={post.id}
                  userImageId={post.user.picId}
                  userFullName={post.user.fullName}
                  numLikes={post._count.likes}
                  description={post.description}
                  imageIds={post.images.map(image => image.imageId)}
                  createdAt={new Date(post.createdAt)}
                />
              </VStack>
            ))}
          </SimpleGrid>
        </FeedCenteredView>
      </VStack>
      <Footer
        appTitle={PRODUCT_NAME}
        developerName={"Allan Simoyi"}
        developerLink={developerLink}
      />
    </VStack>
  );
}