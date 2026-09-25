import { prisma } from "@repo/db";

export const createBoardService = async (
  title: string,
  organisationId: string,
) => {
  const existingBoard = await prisma.board.findFirst({
    where: {
      organisationId,
      title,
    },
  });

  if (existingBoard) {
    throw new Error("Board with same title already exists");
  }

  const board = await prisma.board.create({
    data: {
      title,
      organisationId,
    },
  });

  return {
    board: {
      id: board.id,
      title: board.title,
      organisationId: board.organisationId,
    },
  };
};

export const deleteBoardService = async (id: string) => {
  const board = await prisma.board.findUnique({
    where: {
      id,
    },
  });

  if (!board) {
    throw new Error("No board with this id exists");
  }

  await prisma.board.delete({
    where: {
      id,
    },
  });

  return {
    board: {
      id: board.id,
      title: board.title,
      organisationId: board.organisationId,
    },
  };
};

export const getBoardsService = async (organisationId: string) => {
  const boards = await prisma.board.findMany({
    where: {
      organisationId,
    },
  });

  return {
    boards,
  };
};

export const getBoardService = async (id: string) => {
  const board = await prisma.board.findUnique({
    where: {
      id,
    },
  });

  if (!board) {
    throw new Error("No board with this id exists");
  }

  return {
    board: {
      id: board.id,
      title: board.title,
      organisationId: board.organisationId,
      createdAt: board.createdAt,
      updatedAt: board.updatedAt,
    },
  };
};
