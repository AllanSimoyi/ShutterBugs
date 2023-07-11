import type { BaseActionData } from './forms';
import type { ZodError } from 'zod';

import { json } from '@remix-run/server-runtime';
import { z } from 'zod';

import { convertFieldErrorsToArray } from './forms';

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

export function containsNumbers(str: string) {
  return Boolean(str.match(/\d/));
}

export const CleanPositiveIntSchema = z
  .number({
    invalid_type_error: 'Provide a valid number',
    required_error: 'Provide a number',
  })
  .int({ message: 'Enter a whole number (integer)' })
  .positive({ message: 'Enter a positive number' });
export const StringNumber = z
  .string({
    invalid_type_error: 'Provide a valid number',
    required_error: 'Provide a number',
  })
  .regex(/\d+/, { message: 'Enter a valid number' })
  .transform(Number);
export const PerhapsEmptyRecordIdSchema = z
  .string({
    invalid_type_error: 'Provide a valid record ID',
  })
  .max(50, { message: 'Use less than 51 characters for the record ID' });
export const PresentStringSchema = z
  .string({
    invalid_type_error: 'Provide a valid string',
    required_error: 'Provide a string',
  })
  .min(1, { message: 'Use at least 1 character for the string' });

export const PositiveDecimalSchema = z
  .number({
    invalid_type_error: 'Provide a valid number',
    required_error: 'Provide a number',
  })
  .positive({ message: 'Enter a positive' })
  .or(StringNumber)
  .refine((n) => n > 0);

export const PerhapsZeroDecimalSchema = z
  .number({
    invalid_type_error: 'Provide a valid number',
    required_error: 'Provide a number',
  })
  .min(0, { message: 'Provide a number' })
  .or(StringNumber)
  .refine((n) => n >= 0);

export const PerhapsZeroIntSchema = z
  .number({
    invalid_type_error: 'Provide a valid number',
  })
  .int({ message: 'Enter a whole number (integer)' })
  .min(0)
  .or(StringNumber)
  .refine((n) => n >= 0);

export const PositiveIntSchema = z
  .number({
    invalid_type_error: 'Provide a valid number',
    required_error: 'Provide a number',
  })
  .int({ message: 'Enter a whole number (integer)' })
  .min(1, { message: 'Provide a number' })
  .or(StringNumber)
  .refine((n) => n > 0);

export const RecordIdSchema = z
  .string({
    invalid_type_error: 'Provide a valid record ID',
    required_error: 'Provide a record ID',
  })
  .min(1, { message: 'Provide a valid record ID' })
  .max(50, { message: 'Please use less than 50 characters for the record ID' });

export function ComposeRecordIdSchema(identifier: string) {
  return z
    .number({
      invalid_type_error: `Provide a valid ${identifier} ID`,
      required_error: `Provide a ${identifier} ID`,
    })
    .int({ message: `Provide a valid ${identifier} ID` })
    .min(1, { message: `Provide a valid ${identifier} ID` })
    .or(StringNumber)
    .refine((n) => n > 0);
}

export const DateSchema = z.preprocess(
  (arg) => {
    if (typeof arg == 'string' || arg instanceof Date) {
      return new Date(arg);
    }
  },
  z.date({
    invalid_type_error: 'Provide a valid date',
    required_error: 'Provide a date',
  })
);

export const BooleanSchema = z.preprocess(
  (arg) => {
    if (typeof arg === 'string') {
      return arg === 'true';
    }
  },
  z.boolean({
    invalid_type_error: 'Provide a valid boolean (yes/no)',
    required_error: 'Provide yes/no input',
  })
);

export function hasSuccess(data: unknown): data is { success: boolean } {
  return typeof data === 'object' && data !== null && 'success' in data;
}

export type Result<Ok, Err> =
  | { success: true; data: Ok }
  | { success: false; err: Err };

export function stringifyZodError(zodError: ZodError) {
  const { fieldErrors, formErrors } = zodError.flatten();
  const allErrors = [
    ...(convertFieldErrorsToArray(fieldErrors) || []),
    ...formErrors,
  ];
  return allErrors.join(', ');
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

export function badRequest(data: BaseActionData) {
  return json(data, { status: 400 });
}

export function processBadRequest<DataType>(
  zodError: z.ZodError<DataType>,
  fields: any
) {
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
