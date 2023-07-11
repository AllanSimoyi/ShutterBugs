import { Heart } from 'tabler-icons-react';
import { twMerge } from 'tailwind-merge';

import { FormLiteral } from '~/lib/forms';

import { GhostButton } from './GhostButton';

interface Props {
  postId: string;
  likedByCurrentUser: boolean;
}

export function LikePost(props: Props) {
  const { postId, likedByCurrentUser } = props;

  return (
    <>
      <input
        type="hidden"
        name={FormLiteral.ActionType}
        value={FormLiteral.TogglePostLike}
      />
      <input type="hidden" name="postId" value={postId} />
      <GhostButton type="submit" aria-label="Like Post">
        <Heart
          size={30}
          className={twMerge(
            'transition-all duration-300',
            likedByCurrentUser && 'fill-red-500'
          )}
        />
      </GhostButton>
    </>
  );
}
