import { ButtonGroup, HStack, IconButton, Spacer, useToast } from "@chakra-ui/react";
import { Link, useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import 'react-gallery-carousel/dist/index.css';
import { MessageCircle2 } from "tabler-icons-react";
import { AppLinks } from "~/lib/links";
import { LikePost } from "./LikePost";
import type { UserPicHeaderProps } from "./UserPicHeader";
import { UserPicHeader } from "./UserPicHeader";

interface Props extends UserPicHeaderProps {
  postId: string;
  likedByCurrentUser: boolean;
  p?: number;
}

export function PostCardHeader (props: Props) {
  const { postId, likedByCurrentUser, numLikes, p, ...otherUserPicHeaderProps } = props;

  const fetcher = useFetcher();
  const toast = useToast();

  useEffect(() => {
    if (fetcher.data?.errorMessage) {
      toast({
        title: fetcher.data.errorMessage,
        status: "error",
        isClosable: true,
      });
    }
  }, [fetcher.data, toast]);

  const isTogglingLike = fetcher.state === "submitting" ||
    fetcher.state === "loading";

  const effectiveNumLikes = isTogglingLike ?
    likedByCurrentUser ?
      numLikes - 1 :
      numLikes + 1 :
    numLikes;

  return (
    <HStack align="center" p={p || 2}>
      <UserPicHeader
        {...otherUserPicHeaderProps}
        numLikes={effectiveNumLikes}
      />
      <Spacer />
      <ButtonGroup>
        <IconButton
          as={Link}
          to={AppLinks.Post(postId)}
          variant="ghost"
          aria-label='Comment on post'
          icon={<MessageCircle2 size={30} />}
        />
        <fetcher.Form method="post">
          <LikePost
            postId={postId}
            likedByCurrentUser={isTogglingLike ?
              !likedByCurrentUser :
              likedByCurrentUser}
          />
        </fetcher.Form>
      </ButtonGroup>
    </HStack>
  )
}