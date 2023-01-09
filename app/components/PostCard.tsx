import { Button, ButtonGroup, CardBody, CardFooter, CardHeader, Divider, HStack, IconButton, Input, Spacer, Text, VStack } from "@chakra-ui/react";
import { Form, Link } from "@remix-run/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useMemo } from "react";
import Carousel from 'react-gallery-carousel';
import 'react-gallery-carousel/dist/index.css';
import { cloudinaryImages, METHOD_IDENTIFIER, useCloudinary } from "remix-chakra-reusables";
import { ChevronLeft, ChevronRight, Heart, MessageCircle2 } from "tabler-icons-react";
import { AppLinks } from "~/lib/links";
import { CustomCard } from "./CustomComponents";
import { ProfilePic } from "./ProfilePic";

dayjs.extend(relativeTime);

interface Props {
  currentUserId: string | undefined;
  postId: string;
  userImageId: string;
  userFullName: string;
  numLikes: number;
  description: string;
  imageIds: string[];
  createdAt: Date;
}

const COMMENT_METHOD = "_comment";

export function PostCard (props: Props) {
  const { currentUserId, postId, userImageId, numLikes, description, userFullName, imageIds, createdAt } = props;
  const { CLOUDINARY_CLOUD_NAME } = useCloudinary();

  const imageUrls = useMemo(() => {
    return imageIds
      .map((imageId) => {
        return cloudinaryImages(CLOUDINARY_CLOUD_NAME)
          .getFullImage(imageId)
          .toURL();
      })
      .map((imageUrl) => ({ src: imageUrl }));
  }, [imageIds, CLOUDINARY_CLOUD_NAME]);

  return (
    <CustomCard borderRadius={10} overflow="hidden">
      <Carousel
        images={imageUrls}
        canAutoPlay={false}
        objectFit="cover"
        hasThumbnails={false}
        hasDotButtons="bottom"
        hasIndexBoard={false}
        hasSizeButton={false}
        isLoop={true}
        shouldMaximizeOnClick={true}
        shouldMinimizeOnClick={true}
        leftIcon={(
          <IconButton
            aria-label='Previous Image'
            size="sm"
            borderRadius={"50%"}
            icon={<ChevronLeft />}
            m={2}
          />
        )}
        rightIcon={(
          <IconButton
            aria-label='Next Image'
            size="sm"
            borderRadius={"50%"}
            icon={<ChevronRight />}
            m={2}
          />
        )}
        style={{ flexGrow: 1, maxHeight: "400px" }}
      />
      <CardHeader p={2}>
        <HStack align="center">
          <HStack align="center">
            <ProfilePic
              imageId={userImageId}
              fullName={userFullName}
            />
            <VStack align="flex-start" spacing={0}>
              <Text fontSize="sm" fontWeight="bold">
                {userFullName}
              </Text>
              <Text fontSize="sm">
                <b>{numLikes}</b> {numLikes === 1 ? "like" : "likes"}
              </Text>
            </VStack>
          </HStack>
          <Spacer />
          <ButtonGroup>
            <IconButton
              as={Link}
              to={AppLinks.Post(postId)}
              variant="ghost"
              aria-label='Comment on post'
              icon={<MessageCircle2 size={30} />}
            />
            <IconButton
              variant="ghost"
              aria-label='Like post'
              icon={<Heart size={30} />}
            />
          </ButtonGroup>
        </HStack>
      </CardHeader>
      <CardBody p={2}>
        <VStack align="stretch" spacing={4}>
          {description && (
            <Text fontSize="sm">
              {description}
            </Text>
          )}
          <Text fontSize="sm">
            {dayjs(createdAt).fromNow()}
          </Text>
        </VStack>
      </CardBody>
      <Divider />
      {currentUserId && (
        <Form method="post">
          <CardFooter flexDirection={"column"} alignItems="stretch" p={2}>
            <HStack align="stretch">
              <input
                type="hidden"
                name={METHOD_IDENTIFIER}
                value={COMMENT_METHOD}
              />
              <input
                type="hidden"
                name="postId"
                value={postId}
              />
              <input
                type="hidden"
                name="userId"
                value={currentUserId}
              />
              <Input
                type="text"
                name="content"
                variant="unstyled"
                fontSize="sm"
                placeholder='Add a comment...'
              />
              <Button type="submit" variant="ghost" fontSize="sm">
                Post
              </Button>
            </HStack>
          </CardFooter>
        </Form>
      )}
    </CustomCard>
  )
}