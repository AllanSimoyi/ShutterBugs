import type { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const EmailSchema = z
  .string()
  .email()
  .min(4)
  .max(50)
  .transform((str) => str.toLowerCase().trim())

export const PasswordSchema = z
  .string()
  .min(4)
  .max(50)
  .transform((str) => str.trim());

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: PasswordSchema,
})

export function createPasswordHash (password: string) {
  return bcrypt.hash(password, 10);
}

export function parseRedirectUrl (url: string) {
  const DEFAULT_REDIRECT = "/";
  if (!url || typeof url !== "string") {
    return DEFAULT_REDIRECT;
  }
  if (!url.startsWith("/") || url.startsWith("//")) {
    return DEFAULT_REDIRECT;
  }
  const redirectableUrls = [
    '/',
  ];
  if (redirectableUrls.includes(url)) {
    return url;
  }
  return DEFAULT_REDIRECT;
}

export type CurrentUser = {
  id: string;
  email: string;
}

export enum UserType {
  Buyer = "Buyer / Tenant",
  PropertyOwner = "Property Owner",
  Agency = "Agency",
  Bank = "Bank",
  Admin = "Admin"
}

export enum AccessLevel {
  Regular,
  Admin,
}

export function isNotSysAdmin (userType: string) {
  return !isSysAdmin(userType);
}
export function isSysAdmin (userType: string) {
  return userType === UserType.Admin;
}

export function isNotSysOrCompanyAdmin (userType: string, accessLevel: AccessLevel) {
  return !isSysOrCompanyAdmin(userType, accessLevel);
}
export function isSysOrCompanyAdmin (userType: string, accessLevel: AccessLevel) {
  const isCompanyAdmin = userType === UserType.Agency ||
    userType === UserType.Bank;

  return isSysAdmin(userType) ||
    (isCompanyAdmin && accessLevel === AccessLevel.Admin);
}

export function userToCurrentUser (user: User) {
  const currentUser: CurrentUser = {
    id: user.id,
    email: user.email,
  }
  return currentUser;
}

export const GoogleCallbackSchema = z.object({
  _json: z.object({
    sub: z.string().min(1),
    name: z.string().min(1),
    picture: z.string().min(1),
    email: z.string().min(1),
  })
});

export const FacebookCallbackSchema = z.object({
  _json: z.object({
    id: z.string().min(1),
    email: z.string().min(1),
    name: z.string().min(1),
  })
});