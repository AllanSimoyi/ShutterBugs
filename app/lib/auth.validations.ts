import type { User } from '@prisma/client';

import { z } from 'zod';

export const EmailSchema = z
  .string()
  .email()
  .min(4)
  .max(50)
  .transform((str) => str.toLowerCase().trim());

export const FullNameSchema = z.string().min(3).max(50);

export const PasswordSchema = z
  .string()
  .min(4)
  .max(50)
  .transform((str) => str.trim());

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: PasswordSchema,
});

export function parseRedirectUrl(url: string) {
  const DEFAULT_REDIRECT = '/';
  if (!url || typeof url !== 'string') {
    return DEFAULT_REDIRECT;
  }
  if (!url.startsWith('/') || url.startsWith('//')) {
    return DEFAULT_REDIRECT;
  }
  const redirectableUrls = ['/'];
  if (redirectableUrls.includes(url)) {
    return url;
  }
  return DEFAULT_REDIRECT;
}

export type CurrentUser = {
  id: string;
  email: string;
};

export function userToCurrentUser(user: User) {
  const currentUser: CurrentUser = {
    id: user.id,
    email: user.email,
  };
  return currentUser;
}
