import bcrypt from "bcrypt";
import { prisma } from "../../config/prisma.js";
import { env } from "../../config/env.js";
import { signToken } from "../../utils/jwt.js";
import { ApiError } from "../../utils/ApiError.js";

export const register = async ({ email, password, firstName, lastName }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new ApiError(409, "Email already in use");

  const hashed = await bcrypt.hash(password, env.bcrypt.rounds);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      firstName,
      lastName,
      cart: { create: {} },
    },
    select: { id: true, email: true, firstName: true, lastName: true, role: true },
  });

  const token = signToken({ sub: user.id, email: user.email, role: user.role });
  return { user, token };
};

export const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new ApiError(401, "Invalid credentials");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new ApiError(401, "Invalid credentials");

  const token = signToken({ sub: user.id, email: user.email, role: user.role });
  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
    token,
  };
};
