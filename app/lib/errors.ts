import { z } from 'zod';

const Schema = z.object({
  message: z.string(),
});
export function getErrorMessage(error: unknown) {
  const result = Schema.safeParse(error);
  if (!result.success) {
    return undefined;
  }
  return result.data.message;
}
