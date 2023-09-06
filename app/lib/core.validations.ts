import type { ActionData, FormFieldKey } from './forms';

import { json } from '@remix-run/server-runtime';
import { z } from 'zod';

export enum RecordType {
  User = 'User',
  Subject = 'Subject',
  Topic = 'Topic',
}
export const RECORD_TYPES = [
  RecordType.User,
  RecordType.Subject,
  RecordType.Topic,
] as const;

export enum ResponseMessage {
  Unauthorised = "You're not authorised to access this resource",
  InvalidId = 'Invalid ID provided',
  RecordNotFound = 'Record not found',
  DeletedRecord = 'Record was deleted',
  InvalidMethod = 'Invalid request method provided',
}

export enum StatusCode {
  BadRequest = 400,
  Unauthorised = 401,
  Forbidden = 403,
  NotFound = 404,
}

export const INVALID_VALUES_FROM_SERVER =
  'Received invalid values from server, please contact the system maintainers';

export function containsNumbers(str: string) {
  return Boolean(str.match(/\d/));
}

export const StringNumber = z.coerce.number({
  invalid_type_error: 'Provide a valid number',
  required_error: 'Provide a number',
});

export const PresentStringSchema = z
  .string({
    invalid_type_error: 'Provide a valid string',
    required_error: 'Provide a string',
  })
  .min(1, { message: 'Use at least 1 character for the string' });

export function ComposeRecordIdSchema(
  identifier: string,
  optional?: 'optional'
) {
  const Schema = z.string({
    invalid_type_error: `Enter a valid ${identifier}`,
    required_error: `Enter a ${identifier}`,
  });
  if (optional) {
    return Schema;
  }
  return Schema.min(1, { message: `Enter a valid ${identifier}` });
}
export const RecordIdSchema = ComposeRecordIdSchema('record ID');

export function hasSuccess(data: unknown): data is { success: boolean } {
  return z.object({ success: z.literal(true) }).safeParse(data).success;
}

export function getValidatedId(rawId: any) {
  const result = RecordIdSchema.safeParse(rawId);
  if (!result.success) {
    throw new Response(ResponseMessage.InvalidId, {
      status: StatusCode.BadRequest,
    });
  }
  return result.data;
}

export function badRequest<F extends FormFieldKey = string>(
  data: ActionData<F>,
  _?: Record<F, any>
) {
  return json(data, { status: StatusCode.BadRequest });
}

export function processBadRequest(zodError: z.ZodError<any>, fields: any) {
  const { formErrors, fieldErrors } = zodError.flatten();
  return badRequest({
    fields,
    fieldErrors,
    formError: formErrors.join(', '),
  });
}

export function getQueryParams<T extends string>(url: string, params: T[]) {
  const urlObj = new URL(url);
  return params.reduce(
    (acc, param) => ({
      ...acc,
      [param]: urlObj.searchParams.get(param) || undefined,
    }),
    {} as Record<T, string | undefined>
  );
}

export const TitleSchema = z
  .string({
    required_error: 'Please enter the title',
    invalid_type_error: 'Please provide valid input for the title',
  })
  .min(1, 'Please enter the title first')
  .max(100, 'Please use less than 200 characters for the title');
