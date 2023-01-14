import { ButtonGroup, CardHeader, HStack, IconButton, Spacer } from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import 'react-gallery-carousel/dist/index.css';
import { MessageCircle2 } from "tabler-icons-react";
import { AppLinks } from "~/lib/links";
import { LikePost } from "./LikePost";
import type { UserPicHeaderProps } from "./UserPicHeader";
import { UserPicHeader } from "./UserPicHeader";

interface Props extends UserPicHeaderProps {
  postId: string;
  likedByCurrentUser: boolean;
}

export function PostCardHeader (props: Props) {
  const { postId, likedByCurrentUser, ...userPicHeaderProps } = props;

  return (
    <CardHeader p={2}>
      <HStack align="center">
        <UserPicHeader {...userPicHeaderProps} />
        <Spacer />
        <ButtonGroup>
          <IconButton
            as={Link}
            to={AppLinks.Post(postId)}
            variant="ghost"
            aria-label='Comment on post'
            icon={<MessageCircle2 size={30} />}
          />
          <LikePost
            postId={postId}
            likedByCurrentUser={likedByCurrentUser}
          />
        </ButtonGroup>
      </HStack>
    </CardHeader>
  )
}