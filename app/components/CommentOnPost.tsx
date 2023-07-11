import type { ComponentProps } from 'react';
import 'react-gallery-carousel/dist/index.css';

import { twMerge } from 'tailwind-merge';

import { FormLiteral } from '~/lib/forms';

import { FormTextField } from './FormTextField';
import { GhostButton } from './GhostButton';

interface Props extends ComponentProps<'div'> {
  postId: string;
  isSubmitting: boolean;
  commentRef: React.RefObject<HTMLInputElement>;
}

export function CommentOnPost(props: Props) {
  const { postId, isSubmitting, commentRef, className, ...restOfProps } = props;

  return (
    <div
      className={twMerge('flex flex-col items-stretch px-0 py-2', className)}
      {...restOfProps}
    >
      <input
        type="hidden"
        name={FormLiteral.ActionType}
        value={FormLiteral.Comment}
      />
      <input type="hidden" name="postId" value={postId} />
      <FormTextField
        className="p-0 text-sm"
        ref={commentRef}
        type="text"
        name="content"
        placeholder="Add a comment..."
        disabled={isSubmitting}
        required
      />
      <GhostButton type="submit" className="text-sm" disabled={isSubmitting}>
        {isSubmitting ? 'Posting...' : 'Post'}
      </GhostButton>
    </div>
  );
}
