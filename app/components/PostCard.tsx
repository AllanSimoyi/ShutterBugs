import {
  CardBody,
  Divider,
  Link as ChakraLink,
  Text,
  useColorMode,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { byRadius } from '@cloudinary/url-gen/actions/roundCorners';
import { Link, useFetcher } from '@remix-run/react';
import { useEffect, useMemo, useRef } from 'react';
import 'react-gallery-carousel/dist/index.css';
import { useCloudinary } from 'remix-chakra-reusables';

import { AppLinks } from '~/lib/links';

import { CommentOnPost } from './CommentOnPost';
import { CustomCard } from './CustomComponents';
import { ImageCarousel } from './ImageCarousel';
import { PostCardHeader } from './PostCardHeader';

interface Props {
  currentUserId: string | undefined;
  currentUserFullName: string | undefined;
  postId: string;
  userImageId: string;
  userFullName: string;
  numLikes: number;
  likedByCurrentUser: boolean;
  lastComments: {
    id: string;
    userFullName: string;
    content: string;
  }[];
  numComments: number;
  description: string;
  imageIds: string[];
  createdAt: string;
}

export function PostCard(props: Props) {
  const {
    currentUserId,
    currentUserFullName,
    postId,
    userImageId,
    likedByCurrentUser,
  } = props;
  const { lastComments, numLikes, description, userFullName, imageIds } = props;
  const { createdAt, numComments } = props;

  const { CloudinaryUtil } = useCloudinary();
  const { colorMode } = useColorMode();
  const fetcher = useFetcher();
  const toast = useToast();
  const commentRef = useRef<HTMLInputElement>(null);

  const isSubmittingComment =
    fetcher.state === 'submitting' || fetcher.state === 'loading';

  useEffect(() => {
    if (fetcher.data?.errorMessage) {
      toast({
        title: fetcher.data?.errorMessage,
        status: 'error',
        isClosable: true,
      });
    }
  }, [fetcher.data, toast]);

  useEffect(() => {
    if (isSubmittingComment && commentRef.current) {
      commentRef.current.value = '';
    }
  }, [isSubmittingComment]);

  const imageUrls = useMemo(() => {
    return imageIds
      .map((imageId) => {
        return CloudinaryUtil.image(imageId)
          .roundCorners(byRadius(5))
          .format('auto')
          .quality('auto')
          .toURL();
      })
      .map((imageUrl) => ({ src: imageUrl }));
  }, [imageIds, CloudinaryUtil]);

  return (
    <CustomCard borderRadius={10} overflow="hidden">
      <ImageCarousel imageUrls={imageUrls} maxH="70vh" />
      <PostCardHeader
        userImageId={userImageId}
        userFullName={userFullName}
        numLikes={numLikes}
        postId={postId}
        likedByCurrentUser={likedByCurrentUser}
      />
      <CardBody p={2}>
        <VStack align="stretch" spacing={2}>
          {description && (
            <Text
              fontSize="sm"
              color={
                colorMode === 'light' ? 'blackAlpha.700' : 'whiteAlpha.700'
              }
            >
              {description}
            </Text>
          )}
          {lastComments.length && (
            <VStack align="stretch" spacing={1}>
              {fetcher.submission && (
                <Text fontSize="sm">
                  <b>{currentUserFullName}</b>{' '}
                  {fetcher.submission.formData
                    .get('content')
                    ?.toString()
                    .substring(0, 40)}
                </Text>
              )}
              {(isSubmittingComment
                ? lastComments.slice(0, -1)
                : lastComments
              ).map((comment) => (
                <Text key={comment.id} fontSize="sm">
                  <b>{comment.userFullName}</b>{' '}
                  {comment.content.substring(0, 40)}
                </Text>
              ))}
            </VStack>
          )}
          {numComments > 2 && (
            <ChakraLink
              as={Link}
              to={AppLinks.Post(postId)}
              fontSize="sm"
              color={
                colorMode === 'light' ? 'blackAlpha.700' : 'whiteAlpha.700'
              }
            >
              View All {isSubmittingComment ? numComments + 1 : numComments}{' '}
              Comment(s)
            </ChakraLink>
          )}
          <Text fontSize="sm">{createdAt}</Text>
        </VStack>
      </CardBody>
      <Divider />
      {currentUserId && (
        <fetcher.Form method="post">
          <CommentOnPost
            postId={postId}
            isSubmitting={isSubmittingComment}
            commentRef={commentRef}
          />
        </fetcher.Form>
      )}
    </CustomCard>
  );
}
