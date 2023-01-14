import { CardBody, Divider, Link as ChakraLink, Text, useColorMode, VStack } from "@chakra-ui/react";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import { Link } from "@remix-run/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useMemo } from "react";
import 'react-gallery-carousel/dist/index.css';
import { useCloudinary } from "remix-chakra-reusables";
import { AppLinks } from "~/lib/links";
import { CommentOnPost } from "./CommentonPost";
import { CustomCard } from "./CustomComponents";
import { ImageCarousel } from "./ImageCarousel";
import { PostCardHeader } from "./PostCardHeader";

dayjs.extend(relativeTime);

interface Props {
  currentUserId: string | undefined;
  postId: string;
  userImageId: string;
  userFullName: string;
  numLikes: number;
  likedByCurrentUser: boolean;
  numComments: number;
  description: string;
  imageIds: string[];
  createdAt: Date;
}

export function PostCard (props: Props) {
  const { currentUserId, postId, userImageId, likedByCurrentUser } = props;
  const { numLikes, description, userFullName, imageIds } = props;
  const { createdAt, numComments } = props;

  const { CloudinaryUtil } = useCloudinary();
  const { colorMode } = useColorMode();

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
    <CustomCard borderRadius={10} overflow="hidden">
      <ImageCarousel imageUrls={imageUrls} />
      <PostCardHeader
        userImageId={userImageId}
        userFullName={userFullName}
        numLikes={numLikes}
        postId={postId}
        likedByCurrentUser={likedByCurrentUser}
      />
      <CardBody p={2}>
        <VStack align="stretch" spacing={4}>
          {description && (
            <Text
              fontSize="sm"
              color={colorMode === "light" ? "blackAlpha.800" : "whiteAlpha.800"}
            >
              {description}
            </Text>
          )}
          <ChakraLink as={Link} to={AppLinks.Post(postId)} fontSize="sm">
            View All {numComments} Comment(s)
          </ChakraLink>
          <Text fontSize="sm">
            {dayjs(createdAt).fromNow()}
          </Text>
        </VStack>
      </CardBody>
      <Divider />
      {currentUserId && (
        <CommentOnPost postId={postId} />
      )}
    </CustomCard>
  )
}