import type { User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";
import { createPasswordHash } from "./auth.server";

export type { User } from "@prisma/client";

export async function getUserById (id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail (email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

interface CreateUserProps {
  email: string;
  fullName: string;
  picId: string;
  password: string;
}
export async function createUser (props: CreateUserProps) {
  const { email, fullName, picId, password } = props;

  return prisma.user.create({
    data: {
      email,
      fullName,
      picId,
      hashedPassword: await createPasswordHash(password),
    },
  });
}

export async function deleteUserByEmail (email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin (email: User["email"], password: string) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
  });
  if (!userWithPassword) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.hashedPassword
  );
  if (!isValid) {
    return null;
  }

  const { hashedPassword: _password, ...userWithoutPassword } = userWithPassword;
  return userWithoutPassword;
}
