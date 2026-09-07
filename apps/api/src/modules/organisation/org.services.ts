import { prisma } from "@repo/db";

export const createOrgService = async (
  name: string,
  description: string,
  userId: string,
) => {
  const existingOrganisation = await prisma.organisation.findFirst({
    where: {
      name,
      ownerId: userId,
    },
  });

  if (existingOrganisation) {
    throw new Error("User already exists");
  }

  const org = await prisma.organisation.create({
  data: {
    name,
    description,
    ownerId: userId,
  },
});

  return {
    organisation: {
      id: org.id,
      name: org.name,
      description: org.description
    }
  };
};

export const deleteOrgService = async (id: string, confirmation: string, userId: string) => {
  const organisation = await prisma.organisation.findUnique({
    where: { id },
  })

  if (!organisation) {
    throw new Error('Organisation not found')
  }

  if (organisation.ownerId !== userId) {
    throw new Error('Only the owner can delete this organisation')
  }

};
