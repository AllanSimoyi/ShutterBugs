import { HStack, Text, useColorMode, VStack } from "@chakra-ui/react";
import { getLiteTextColor } from "~/lib/text";
import { ProfilePic } from "./ProfilePic";

interface Props {
  userImageId: string;
  userFullName: string;
  content: string;
}

export function OptimisticActionableComment (props: Props) {
  const { userImageId, userFullName, content } = props;

  const { colorMode } = useColorMode();

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
          Processing...
        </Text>
      </VStack>
    </HStack>
  )
}