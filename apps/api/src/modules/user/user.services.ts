import { prisma, User } from "@repo/db";

export const getService = async (user: User) => {
  const email = user.email;
  if (!email) {
    throw new Error("User not found");
  }

  const fetchedUser = prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!fetchedUser) {
    throw new Error("User not found.");
  }

  return {
    user: {
      id: user.id,
      email: user.email,
    },
  };
};
