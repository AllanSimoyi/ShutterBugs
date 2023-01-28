import type { LoaderArgs } from '@remix-run/server-runtime';

import {
  Button,
  HStack,
  Img,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { Link, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/server-runtime';
import { useCallback } from 'react';
import { CenteredView, useCloudinary } from 'remix-chakra-reusables';
import { Pencil, Share } from 'tabler-icons-react';

import { ProfilePic } from '~/components/ProfilePic';
import { Toolbar } from '~/components/Toolbar';
import { prisma } from '~/db.server';
import { AppLinks } from '~/lib/links';
import { requireUserId } from '~/session.server';
import { useUser } from '~/utils';

export async function loader({ request }: LoaderArgs) {
  const currentUserId = await requireUserId(request);

  const posts = await prisma.post.findMany({
    where: {
      userId: currentUserId,
    },
    select: {
      id: true,
      images: {
        select: {
          imageId: true,
        },
      },
    },
  });

  return json({ posts });
}

export default function ProfilePage() {
  const currentUser = useUser();
  const { posts } = useLoaderData<typeof loader>();

  const { CloudinaryUtil } = useCloudinary();

  const getImageUrl = useCallback(
    (imageId: string) => {
      return (
        CloudinaryUtil.image(imageId)
          .resize(fill().aspectRatio('1:1'))
          // .resize(thumbnail().height(120))
          .format('auto')
          .quality('auto')
          .toURL()
      );
    },
    [CloudinaryUtil]
  );

  return (
    <VStack align="stretch" minH="100vh">
      <Toolbar
        currentUserName={currentUser.fullName || ''}
        hideSearchOnMobile={true}
      />
      <CenteredView align="stretch" flexGrow={1} p={4}>
        <VStack align="center" spacing={2} py={4}>
          <ProfilePic
            imageId={currentUser.picId}
            fullName={currentUser.fullName}
            large
          />
          <VStack align="center" spacing={0}>
            <Text fontSize="2xl" fontWeight="bold">
              {currentUser.fullName}
            </Text>
            <Text fontSize="sm">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            </Text>
          </VStack>
          <HStack align="center" py={4} spacing={4}>
            <Button
              as={Link}
              to={AppLinks.EditProfile}
              size="md"
              variant="solid"
              leftIcon={<Pencil />}
              aria-label="Edit Profile"
            >
              Edit
            </Button>
            <Button
              size="md"
              variant="outline"
              leftIcon={<Share />}
              aria-label="Share Profile"
            >
              Share
            </Button>
          </HStack>
        </VStack>
        <VStack align="stretch" py={6}>
          <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={1}>
            {posts
              .filter((post) => post.images.length)
              .map((post) => (
                <Link key={post.id} to={AppLinks.Post(post.id)}>
                  <Img
                    _hover={{
                      transform: 'scale(1.1)',
                    }}
                    transitionDuration="0.2s"
                    transitionTimingFunction="ease-in-out"
                    w="100%"
                    h="auto"
                    objectFit="cover"
                    src={getImageUrl(post.images[0]?.imageId)}
                  />
                </Link>
              ))}
          </SimpleGrid>
        </VStack>
      </CenteredView>
    </VStack>
  );
}
