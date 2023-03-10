import { HStack, Text, VStack } from "@chakra-ui/react";
import { NumLikes } from "./NumLikes";
import { ProfilePic } from "./ProfilePic";

export interface UserPicHeaderProps {
  userImageId: string;
  userFullName: string;
  numLikes: number;
}

export function UserPicHeader (props: UserPicHeaderProps) {
  const { userImageId, userFullName, numLikes } = props;

  return (
    <HStack align="center" spacing={4}>
      <ProfilePic
        imageId={userImageId}
        fullName={userFullName}
      />
      <VStack align="flex-start" spacing={0}>
        <Text fontSize="sm" fontWeight="bold">
          {userFullName}
        </Text>
        <Text fontSize="sm">
          <NumLikes>
            {numLikes}
          </NumLikes>
        </Text>
      </VStack>
    </HStack>
  )
}