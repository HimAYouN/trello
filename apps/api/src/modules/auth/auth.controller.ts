import type { Request, Response } from "express";
import { registerSchema, loginSchema, refreshSchema } from "./auth.schema";
import { registerUser, loginUser, refreshTokens, logoutUser } from "./auth.service";

export const register = async (req: Request, res: Response) => {
  const parsed = registerSchema.parse(req.body);
  const user = await registerUser(parsed);
  res.status(201).json({ user });
};

export const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.parse(req.body);
  const { user, accessToken, refreshToken } = await loginUser(parsed);
  res.json({ user, accessToken, refreshToken });
};

export const refresh = async (req: Request, res: Response) => {
  const parsed = refreshSchema.parse(req.body);
  const { accessToken } = await refreshTokens(parsed);
  res.json({ accessToken });
};

export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  await logoutUser(refreshToken);
  res.status(204).send();
};