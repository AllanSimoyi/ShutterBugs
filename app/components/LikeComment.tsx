import { Heart } from 'tabler-icons-react';
import { twMerge } from 'tailwind-merge';

import { FormLiteral } from '~/lib/forms';

import { GhostButton } from './GhostButton';

interface Props {
  commentId: string;
  likedByCurrentUser: boolean;
}

export function LikeComment(props: Props) {
  const { commentId, likedByCurrentUser } = props;

  return (
    <>
      <input
        type="hidden"
        name={FormLiteral.ActionType}
        value={FormLiteral.ToggleCommentLike}
      />
      <input type="hidden" name="commentId" value={commentId} />
      <GhostButton type="submit" aria-label="Like Comment">
        <Heart
          size={20}
          className={twMerge(
            'transition-all duration-300',
            likedByCurrentUser && 'fill-red-500'
          )}
          // style={{ fill: likedByCurrentUser ? '#E53E3E' : undefined }}
        />
      </GhostButton>
    </>
  );
}
