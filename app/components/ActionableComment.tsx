import { HStack, Spacer, Text, useColorMode, useToast, VStack } from "@chakra-ui/react";
import { getLiteTextColor } from "~/lib/text";
import { NumLikes } from "./NumLikes";
import { ProfilePic } from "./ProfilePic";
import { LikeComment } from "./LikeComment";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";

interface Props {
  id: string;
  userImageId: string;
  userFullName: string;
  content: string;
  numLikes: number;
  likedByCurrentUser: boolean;
  createdAt: string;
}

export function ActionableComment (props: Props) {
  const { id, userImageId, userFullName, content, numLikes, likedByCurrentUser, createdAt } = props;

  const { colorMode } = useColorMode();
  const fetcher = useFetcher();
  const toast = useToast();

  const isTogglingLike = fetcher.state === "submitting" ||
    fetcher.state === "loading";

  const effectiveNumLikes = isTogglingLike ?
    likedByCurrentUser ?
      numLikes - 1 :
      numLikes + 1 :
    numLikes;

  useEffect(() => {
    if (fetcher.data?.errorMessage) {
      toast({
        title: fetcher.data.errorMessage,
        status: "error",
        isClosable: true,
      });
    }
  }, [fetcher.data, toast]);

  return (
    <HStack align="center" spacing={4}>
      <VStack align="stretch" flexShrink={0}>
        <ProfilePic
          imageId={userImageId}
          fullName={userFullName}
        />
      </VStack>
      <VStack align="stretch" spacing={0}>
        <Text fontSize={{ base: "xs", lg: "sm" }}>
          <b>{userFullName}</b> {content.substring(0, 40)}
        </Text>
        <Text fontSize="xs" color={getLiteTextColor(colorMode)}>
          {createdAt} &middot; <NumLikes>{effectiveNumLikes}</NumLikes>
        </Text>
      </VStack>
      <Spacer />
      <fetcher.Form method="post">
        <LikeComment
          commentId={id}
          likedByCurrentUser={isTogglingLike ?
            !likedByCurrentUser :
            likedByCurrentUser}
        />
      </fetcher.Form>
    </HStack>
  )
}