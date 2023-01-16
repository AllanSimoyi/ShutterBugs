import { json } from "@remix-run/server-runtime";
import { prisma } from "~/db.server";
import { flattenFieldErrors, PostCommentSchema, ToggleCommentLikeSchema, TogglePostLikeSchema } from "~/lib/forms.validations";

interface FlattenErrorsProps {
  fieldErrors: {
    [x: string]: string[] | undefined;
  },
  formErrors: string[]
}
export function flattenErrors (props: FlattenErrorsProps) {
  const { fieldErrors, formErrors } = props;

  const flattenedFieldErrors = fieldErrors ?
    flattenFieldErrors(fieldErrors) :
    "";
  const flattenedFormErrors = formErrors.join(", ");

  return [flattenedFieldErrors, flattenedFormErrors]
    .filter(el => el)
    .join(", ");
}

export async function handlePostComment (fields: any, currentUserId: string) {
  const result = await PostCommentSchema.safeParseAsync(fields);
  if (!result.success) {
    const { fieldErrors, formErrors } = result.error.flatten();
    const errorMessage = flattenErrors({ fieldErrors, formErrors });
    return json({ errorMessage });
  }
  const { postId, content } = result.data;

  await prisma.comment.create({
    data: {
      postId,
      userId: currentUserId,
      content,
    }
  });
  return json({ errorMessage: "" });
}

export async function handleTogglePostLike (fields: any, currentUserId: string) {
  const result = await TogglePostLikeSchema.safeParseAsync(fields);
  if (!result.success) {
    const { fieldErrors, formErrors } = result.error.flatten();
    const errorMessage = flattenErrors({ fieldErrors, formErrors });
    return json({ errorMessage });
  }
  const { postId } = result.data;

  const currentUserLikes = await prisma.postLike.findMany({
    where: {
      postId,
      userId: currentUserId,
    }
  });
  if (currentUserLikes.length) {
    await Promise.all(
      currentUserLikes.map(currentUserLike => {
        return prisma.postLike.delete({
          where: {
            id: currentUserLike.id,
          }
        });
      })
    );
  } else {
    await prisma.postLike.create({
      data: {
        postId,
        userId: currentUserId,
      }
    });
  }
  return json({ errorMessage: "" });
}

export async function handleToggleCommentLike (fields: any, currentUserId: string) {
  const result = await ToggleCommentLikeSchema.safeParseAsync(fields);
  if (!result.success) {
    const { fieldErrors, formErrors } = result.error.flatten();
    const errorMessage = flattenErrors({ fieldErrors, formErrors });
    return json({ errorMessage });
  }
  const { commentId } = result.data;

  const currentUserCommentLikes = await prisma.commentLike.findMany({
    where: {
      commentId,
      userId: currentUserId,
    }
  });
  if (currentUserCommentLikes.length) {
    await Promise.all(
      currentUserCommentLikes.map(currentUserCommentLike => {
        return prisma.commentLike.delete({
          where: {
            id: currentUserCommentLike.id,
          }
        });
      })
    );
  } else {
    await prisma.commentLike.create({
      data: {
        commentId,
        userId: currentUserId,
      }
    });
  }
  return json({ errorMessage: "" });
}