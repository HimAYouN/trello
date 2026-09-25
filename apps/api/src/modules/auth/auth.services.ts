import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@repo/db";
import { env } from "@repo/env";

export const registerService = async (
  email: string,
  password: string,
  name: string,
) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
    },
  };
};

export const loginService = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    env.JWT_SECRET!,
    {
      expiresIn: "7d",
    },
  );

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    token,
  };
};


