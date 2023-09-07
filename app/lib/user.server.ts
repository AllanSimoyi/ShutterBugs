import type { User } from '@prisma/client';

import bcrypt from 'bcryptjs';

import { prisma } from '~/db.server';

import { createPasswordHash } from './auth.server';

export type { User } from '@prisma/client';

export async function getUserById(id: User['id']) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByPhone(phone: User['phone']) {
  return prisma.user.findUnique({ where: { phone } });
}

interface CreateUserProps {
  phone: string;
  fullName: string;
  imageId: string;
  password: string;
}
export async function createUser(props: CreateUserProps) {
  const { phone, fullName, imageId, password } = props;

  return prisma.user.create({
    data: {
      phone,
      fullName,
      imageId,
      hashedPassword: await createPasswordHash(password),
    },
  });
}

export async function deleteUserByPhone(phone: User['phone']) {
  return prisma.user.delete({ where: { phone } });
}

export async function verifyLogin(phone: User['phone'], password: string) {
  const userWithPassword = await prisma.user.findUnique({
    where: { phone },
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

  const { hashedPassword: _password, ...userWithoutPassword } =
    userWithPassword;
  return userWithoutPassword;
}
