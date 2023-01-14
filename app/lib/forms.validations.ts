import { RecordIdSchema } from "remix-chakra-reusables";
import { z } from "zod";

export const FormActionName = "_action";

export enum FormActionIdentifier {
  Comment = "_comment",
  TogglePostLike = "_togglePostLike",
  ToggleCommentLike = "_toggleCommentLike",
}

export const FormActionSchema = z.object({
  [FormActionName]: z.enum([
    FormActionIdentifier.Comment,
    FormActionIdentifier.TogglePostLike,
    FormActionIdentifier.ToggleCommentLike,
  ]),
});

export const PostIdObjectSchema = z.object({
  postId: RecordIdSchema,
});

export const PostCommentSchema = z.object({
  postId: RecordIdSchema,
  content: z.string().min(1).max(800),
});
export const TogglePostLikeSchema = z.object({
  postId: RecordIdSchema,
});
export const ToggleCommentLikeSchema = z.object({
  postId: RecordIdSchema,
});

interface FieldErrors {
  [x: string]: string[] | undefined;
}
export function flattenFieldErrors (fieldErrors: FieldErrors) {
  return Object
    .keys(fieldErrors)
    .map(key => ({
      key,
      errors: fieldErrors[key]
    }))
    .filter(el => el)
    .map(el => `${el.key}: ${el.errors?.join(", ")}`)
    .join(", ");
}