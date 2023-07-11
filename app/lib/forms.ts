import { z } from 'zod';

export type CustomFormFields<SchemaType = any> = {
  [T in keyof SchemaType]: string | File;
};
export type CustomFieldErrors<SchemaType = any> = {
  [T in keyof SchemaType]: string[] | undefined;
};

export interface BaseActionData {
  formError?: string;
  fields?: {
    [index: string]: string | File;
  };
  fieldErrors?: {
    [index: string]: string[] | undefined;
  };
}

const ResponseRecordedSchema = z.object({
  responseRecorded: z.boolean(),
});
export function hasResponseRecorded(
  data: unknown
): data is z.infer<typeof ResponseRecordedSchema> {
  return ResponseRecordedSchema.safeParse(data).success;
}

const FormErrorSchema = z.object({
  formError: z.string().min(1),
});
export function hasFormError(
  data: unknown
): data is z.infer<typeof FormErrorSchema> {
  return FormErrorSchema.safeParse(data).success;
}

const FieldErrorsSchema = z.object({
  fieldErrors: z.record(z.string().array().optional()),
});
export function hasFieldErrors(
  data: unknown
): data is z.infer<typeof FieldErrorsSchema> {
  return FieldErrorsSchema.safeParse(data).success;
}

const FieldsSchema = z.object({
  fields: z.record(z.string()),
});
export function hasFields(data: unknown): data is z.infer<typeof FieldsSchema> {
  return FieldsSchema.safeParse(data).success;
}

const WithErrMsgSchema = z.object({
  errorMessage: z.string(),
});
export function hasErrorMessage(
  data: unknown
): data is z.infer<typeof WithErrMsgSchema> {
  return WithErrMsgSchema.safeParse(data).success;
}

export function convertFieldErrorsToArray(
  fieldErrors: BaseActionData['fieldErrors']
) {
  if (!fieldErrors) {
    return undefined;
  }
  return Object.keys(fieldErrors)
    .map((key) => {
      const errors = fieldErrors[key];
      if (!errors) {
        return undefined;
      }
      return errors.join(', ');
    })
    .filter(Boolean);
}

export async function getRawFormFields(request: Request) {
  const formData = await request.formData();
  return Object.fromEntries(formData.entries());
}

export const _METHOD = '_method';
export const _METHOD_DELETE = '_method_delete';

export const FormLiteral = {
  ActionType: '_action_type',
  Comment: '_comment',
  TogglePostLike: '_toggle_post_like',
  ToggleCommentLike: '_toggle_comment_like',
};

export const FormActionSchema = z.object({
  _action_type: z.enum([
    FormLiteral.Comment,
    FormLiteral.TogglePostLike,
    FormLiteral.ToggleCommentLike,
  ]),
});

export function getIsOnlyDeleteMethod(formData: FormData) {
  return formData.get(_METHOD) === _METHOD_DELETE;
}
