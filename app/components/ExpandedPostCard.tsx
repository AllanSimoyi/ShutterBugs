import { Divider, Heading, HStack, Spacer, Text, useColorMode, useToast, VStack } from "@chakra-ui/react";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import { useFetcher } from "@remix-run/react";
import { useEffect, useMemo, useRef } from "react";
import 'react-gallery-carousel/dist/index.css';
import { RecordsNotFound, useCloudinary } from "remix-chakra-reusables";
import { ActionableComment } from "./ActionableComment";
import { CommentOnPost } from "./CommentOnPost";
import { ImageCarousel } from "./ImageCarousel";
import { OptimisticActionableComment } from "./OptimisticActionableComment";
import { PostCardHeader } from "./PostCardHeader";
import { PostDropDownMenu } from "./PostDropDownMenu";

interface Props {
  currentUserId: string | undefined;
  currentUserFullName: string | undefined;
  currentUserImageId: string | undefined;
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
    likedByCurrentUser: boolean;
    numLikes: number;
    createdAt: string;
  }[],
  description: string;
  imageIds: string[];
  createdAt: string;
}

export function ExpandedPostCard (props: Props) {
  const { currentUserId, currentUserFullName, currentUserImageId, postId, userImageId, likedByCurrentUser } = props;
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
        <VStack
          display={{ base: "none", lg: "flex" }}
          bgColor="blackAlpha.100"
          justify="center"
          align="stretch"
          w="50%"
        >
          <ImageCarousel imageUrls={imageUrls} />
        </VStack>
        <VStack h="100%" align="stretch" w={{ base: "100%", lg: "50%" }} spacing={0}>
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
              <OptimisticActionableComment
                userImageId={currentUserImageId || ""}
                userFullName={currentUserFullName || ""}
                content={fetcher.submission.formData.get("content")?.toString() || ""}
              />
            )}
            {!comments.length && (
              <VStack justify={"center"} align="center" p={4} flexGrow={1}>
                <RecordsNotFound>
                  No comments yet
                </RecordsNotFound>
              </VStack>
            )}
            {comments.map(comment => (
              <ActionableComment
                key={comment.id}
                id={comment.id}
                userImageId={comment.userImageId}
                userFullName={comment.userFullName}
                content={comment.content}
                numLikes={comment.numLikes}
                likedByCurrentUser={comment.likedByCurrentUser}
                createdAt={comment.createdAt}
              />
            ))}
          </VStack>
          <Divider />
          <VStack align="stretch" display={{ base: comments.length ? "none" : "flex", lg: "flex" }}>
            <PostCardHeader
              userImageId={userImageId}
              userFullName={userFullName}
              numLikes={numLikes}
              postId={postId}
              likedByCurrentUser={likedByCurrentUser}
              p={4}
            />
          </VStack>
          <VStack
            display={{ base: comments.length ? "none" : "flex", lg: "flex" }}
            overflowY="auto"
            align="stretch"
            spacing={2}
            p={4}
          >
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