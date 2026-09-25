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
    throw new Error("Organisation already exists");
  }

  const organisation = await prisma.organisation.create({
    data: {
      name,
      description,
      ownerId: userId,
    },
  });

  const membership = await prisma.membership.create({
    data: {
      organisationId: organisation.id,
      userId,
      role: "OWNER",
    },
  });

  return {
    id: organisation.id,
    organisation: {
      id: organisation.id,
      name: organisation.name,
      description: organisation.description,
    },
    membership: {
      userId: membership.userId,
      role: membership.role,
      organisationId: membership.organisationId,
    },
  };
};

export const deleteOrgService = async (
  id: string,
  confirmation: boolean | string,
  userId: string,
) => {
  const organisation = await prisma.organisation.findUnique({
    where: { id },
  });

  if (!organisation) {
    throw new Error("Organisation not found");
  }

  if (organisation.ownerId !== userId) {
    throw new Error("Only the owner can delete this organisation");
  }

  const isConfirmed = confirmation === true || confirmation === "true";

  if (!isConfirmed) {
    throw new Error("Confirmation is required");
  }

  await prisma.membership.deleteMany({
    where: {
      organisationId: id,
    },
  });

  await prisma.organisation.delete({
    where: { id },
  });

  return {
    id: organisation.id,
    name: organisation.name,
  };
};

export const inviteService = async (
  id: string,
  email: string,
  userId: string,
) => {
  const organisation = await prisma.organisation.findUnique({
    where: { id },
  });

  if (!organisation) {
    throw new Error("Organisation not found");
  }

  if (organisation.ownerId !== userId) {
    throw new Error("Only the organisation owner can invite users");
  }

  const invitedUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!invitedUser) {
    throw new Error("User not found");
  }

  const membership = await prisma.membership.upsert({
    where: {
      userId_organisationId: {
        userId: invitedUser.id,
        organisationId: id,
      },
    },
    update: {
      role: "MEMBER",
    },
    create: {
      userId: invitedUser.id,
      organisationId: id,
      role: "MEMBER",
    },
  });

  return {
    membershipId: membership.id,
    organisationId: membership.organisationId,
    userId: membership.userId,
    role: membership.role,
  };
};

export const acceptService = async (
  id: string,
  confirmation: boolean | string,
  userId: string,
) => {
  const isConfirmed = confirmation === true || confirmation === "true";

  if (!isConfirmed) {
    throw new Error("Confirmation is required");
  }

  const membership = await prisma.membership.findUnique({
    where: {
      userId_organisationId: {
        userId,
        organisationId: id,
      },
    },
  });

  if (!membership) {
    throw new Error("Membership not found");
  }

  return {
    membershipId: membership.id,
    organisationId: membership.organisationId,
    userId: membership.userId,
    role: membership.role,
  };
};
