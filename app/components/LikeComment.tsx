import { IconButton } from "@chakra-ui/react";
import { Heart } from "tabler-icons-react";
import { FormActionIdentifier, FormActionName } from "~/lib/forms.validations";

interface Props {
  commentId: string;
  likedByCurrentUser: boolean;
}

export function LikeComment (props: Props) {
  const { commentId, likedByCurrentUser } = props;

  return (
    <>
      <input
        type="hidden"
        name={FormActionName}
        value={FormActionIdentifier.ToggleCommentLike}
      />
      <input
        type="hidden"
        name="commentId"
        value={commentId}
      />
      <IconButton
        type="submit"
        variant="ghost"
        color={likedByCurrentUser ? "red.500" : undefined}
        aria-label='Like comment'
        icon={(
          <Heart
            size={20}
            style={{ fill: likedByCurrentUser ? "#E53E3E" : undefined }}
          />
        )}
      />
    </>
  )
}