import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "@repo/env";

export const hashPassword = (password: string) => bcrypt.hash(password, 10);
export const comparePassword = (password: string, hash: string) => bcrypt.compare(password, hash);

export const signAccessToken = (payload: object) =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: "15m" });

export const signRefreshToken = (payload: object) =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, env.JWT_ACCESS_SECRET);

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, env.JWT_REFRESH_SECRET);