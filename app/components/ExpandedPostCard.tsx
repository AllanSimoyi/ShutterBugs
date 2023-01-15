import { Divider, Heading, HStack, Spacer, Text, useColorMode, useToast, VStack } from "@chakra-ui/react";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import { useFetcher } from "@remix-run/react";
import { useEffect, useMemo, useRef } from "react";
import 'react-gallery-carousel/dist/index.css';
import { useCloudinary } from "remix-chakra-reusables";
import { CommentOnPost } from "./CommentOnPost";
import { ImageCarousel } from "./ImageCarousel";
import { NumLikes } from "./NumLikes";
import { PostCardHeader } from "./PostCardHeader";
import { PostDropDownMenu } from "./PostDropDownMenu";
import { ProfilePic } from "./ProfilePic";

interface Props {
  currentUserId: string | undefined;
  currentUserFullName: string | undefined;
  postId: string;
  userImageId: string;
  userFullName: string;
  numLikes: number;
  likedByCurrentUser: boolean;
  comments: {
    id: string;
    userImageId: string;
    userFullName: string;
    content: string;
    numLikes: number;
    createdAt: string;
  }[],
  description: string;
  imageIds: string[];
  createdAt: string;
}

export function ExpandedPostCard (props: Props) {
  const { currentUserId, currentUserFullName, postId, userImageId, likedByCurrentUser } = props;
  const { comments, numLikes, description, userFullName, imageIds, createdAt } = props;

  const { CloudinaryUtil } = useCloudinary();
  const { colorMode } = useColorMode();
  const fetcher = useFetcher();
  const toast = useToast();
  const commentRef = useRef<HTMLInputElement>(null);

  const liteTextColor = colorMode === "light" ?
    "blackAlpha.700" :
    "whiteAlpha.700";

  const isSubmittingComment = fetcher.state === "submitting" ||
    fetcher.state === "loading";

  useEffect(() => {
    if (fetcher.data?.errorMessage) {
      toast({
        title: fetcher.data?.errorMessage,
        status: "error",
        isClosable: true,
      });
    }
  }, [fetcher.data, toast]);

  useEffect(() => {
    if (isSubmittingComment && commentRef.current) {
      commentRef.current.value = "";
    }
  }, [isSubmittingComment]);

  const imageUrls = useMemo(() => {
    return imageIds
      .map((imageId) => {
        return CloudinaryUtil
          .image(imageId)
          .roundCorners(byRadius(5))
          .format('auto')
          .quality('auto')
          .toURL();
      })
      .map((imageUrl) => ({ src: imageUrl }));
  }, [imageIds, CloudinaryUtil]);

  return (
    <VStack
      align="stretch"
      shadow="md"
      borderRadius={10}
      overflow="hidden"
      h="100%"
      spacing={0}
      backdropFilter="saturate(180%) blur(5px)"
      bgColor={colorMode === "light" ? "white" : "whiteAlpha.200"}
    >
      <HStack h="100%" justify="center" align="stretch" spacing={0}>
        <VStack justify="center" align="stretch" w="50%" bgColor="blackAlpha.100">
          <ImageCarousel imageUrls={imageUrls} />
        </VStack>
        <VStack h="100%" align="stretch" w={{ base: "100%", sm: "50%" }} spacing={0}>
          <HStack align="center" p={4}>
            <Heading size="sm">
              Comments
            </Heading>
            <Spacer />
            <PostDropDownMenu />
          </HStack>
          <Divider />
          <VStack align="stretch" flexGrow={1} overflowY="auto" spacing={4} p={4}>
            {fetcher.submission && (
              <Text fontSize="sm">
                <b>{currentUserFullName}</b> {fetcher.submission.formData.get("content")?.toString().substring(0, 40)}
              </Text>
            )}
            {comments.map(comment => (
              <HStack key={comment.id} align="center" spacing={4}>
                <ProfilePic
                  imageId={comment.userImageId}
                  fullName={comment.userFullName}
                />
                <VStack align="stretch" spacing={0}>
                  <Text fontSize="sm">
                    <b>{comment.userFullName}</b> {comment.content.substring(0, 40)}
                  </Text>
                  <Text fontSize="xs" color={liteTextColor}>
                    {createdAt} &middot; <NumLikes>{numLikes}</NumLikes>
                  </Text>
                </VStack>
              </HStack>
            ))}
          </VStack>
          <Divider />
          <PostCardHeader
            userImageId={userImageId}
            userFullName={userFullName}
            numLikes={numLikes}
            postId={postId}
            likedByCurrentUser={likedByCurrentUser}
            p={4}
          />
          <VStack overflowY="auto" align="stretch" p={4} spacing={2}>
            {description && (
              <Text fontSize="sm" color={liteTextColor}>
                {description}
              </Text>
            )}
            <Text fontSize="sm">
              {createdAt}
            </Text>
          </VStack>
          <Divider />
          {currentUserId && (
            <fetcher.Form method="post">
              <CommentOnPost
                pr={4}
                pl={2}
                py={2}
                postId={postId}
                isSubmitting={isSubmittingComment}
                commentRef={commentRef}
              />
            </fetcher.Form>
          )}
        </VStack>
      </HStack>
    </VStack>
  )
}