import bcrypt from 'bcryptjs';

export function createPasswordHash(password: string) {
  return bcrypt.hash(password, 10);
}
