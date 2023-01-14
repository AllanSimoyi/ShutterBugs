import { IconButton } from "@chakra-ui/react";
import { useFetcher } from "@remix-run/react";
import { Heart } from "tabler-icons-react";
import { FormActionIdentifier, FormActionName } from "~/lib/forms.validations";

interface Props {
  postId: string;
  likedByCurrentUser: boolean;
}

export function LikePost (props: Props) {
  const { postId, likedByCurrentUser } = props;
  const fetcher = useFetcher();

  const isLiking = fetcher.state === "submitting" ||
    fetcher.state === "loading";

  const effectiveState = isLiking ? !likedByCurrentUser : likedByCurrentUser;

  return (
    <fetcher.Form method="post">
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
        color={effectiveState ? "red.400" : undefined}
        style={{ fill: effectiveState ? "red" : undefined }}
        aria-label='Like post'
        icon={<Heart size={30} />}
      />
    </fetcher.Form>
  )
}