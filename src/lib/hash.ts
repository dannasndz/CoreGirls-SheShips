import bcrypt from "bcryptjs";

export const hashPassword = (password: string) => bcrypt.hash(password, 12);

export const verifyPassword = (password: string, hash: string) =>
  bcrypt.compare(password, hash);
