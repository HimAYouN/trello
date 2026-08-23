// // auth.service.ts
// import type { SafeUser, LoginResult } from "./auth.types";
// import { prisma} from "@repo/db"

// export const loginUser = async (input: LoginInput): Promise<LoginResult> => {
//   const user = await prisma.user.findUnique({ where: { email: input.email } });
//   if (!user || !(await comparePassword(input.password, user.password))) {
//     throw new Error("Invalid credentials");
//   }

//   const accessToken = signAccessToken({ userId: user.id });
//   const refreshToken = signRefreshToken({ userId: user.id });

//   await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id } });

//   const safeUser: SafeUser = { id: user.id, email: user.email, name: user.name };

//   return { user: safeUser, accessToken, refreshToken };
// };


import { prisma } from "@repo/db";
import {
  hashPassword,
  comparePassword,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "./auth.utils";
import type { RegisterInput, LoginInput, RefreshInput } from "./auth.schema";
import { AppError } from "./auth.types";

export const registerUser = async (input: RegisterInput) => {
  const hashed = await hashPassword(input.password);
  return prisma.user.create({ data: { ...input, password: hashed } });
};

export const loginUser = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user || !(await comparePassword(input.password, user.password))) {
  throw new AppError("Invalid credentials", 401);
}

  const accessToken = signAccessToken({ userId: user.id });
  const refreshToken = signRefreshToken({ userId: user.id });

  // store refresh token so you can revoke it later (recommended)
  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id },
  });

  return { user, accessToken, refreshToken };
};

export const refreshTokens = async (input: RefreshInput) => {
  const payload = verifyRefreshToken(input.refreshToken) as { userId: string };

  const stored = await prisma.refreshToken.findUnique({
    where: { token: input.refreshToken },
  });
  if (!stored) throw new Error("Refresh token revoked or invalid");

  const newAccessToken = signAccessToken({ userId: payload.userId });
  return { accessToken: newAccessToken };
};

export const logoutUser = async (refreshToken: string) => {
  await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
};