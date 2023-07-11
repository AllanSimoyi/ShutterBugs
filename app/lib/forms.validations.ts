import { z } from 'zod';

import { RecordIdSchema } from './core.validations';

export const PostCommentSchema = z.object({
  postId: RecordIdSchema,
  content: z.string().min(1).max(800),
});
export const TogglePostLikeSchema = z.object({
  postId: RecordIdSchema,
});
export const ToggleCommentLikeSchema = z.object({
  commentId: RecordIdSchema,
});

interface FieldErrors {
  [x: string]: string[] | undefined;
}
export function flattenFieldErrors(fieldErrors: FieldErrors) {
  return Object.keys(fieldErrors)
    .map((key) => ({
      key,
      errors: fieldErrors[key],
    }))
    .filter((el) => el)
    .map((el) => `${el.key}: ${el.errors?.join(', ')}`)
    .join(', ');
}
