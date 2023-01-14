import { IconButton } from "@chakra-ui/react";
import { Heart } from "tabler-icons-react";
import { FormActionIdentifier, FormActionName } from "~/lib/forms.validations";

interface Props {
  postId: string;
  likedByCurrentUser: boolean;
}

export function LikePost (props: Props) {
  const { postId, likedByCurrentUser } = props;

  return (
    <>
      <input
        type="hidden"
        name={FormActionName}
        value={FormActionIdentifier.TogglePostLike}
      />
      <input
        type="hidden"
        name="postId"
        value={postId}
      />
      <IconButton
        type="submit"
        variant="ghost"
        color={likedByCurrentUser ? "red.500" : undefined}
        aria-label='Like post'
        icon={(
          <Heart
            size={30}
            style={{ fill: likedByCurrentUser ? "#E53E3E" : undefined }}
          />
        )}
      />
    </>
  )
}