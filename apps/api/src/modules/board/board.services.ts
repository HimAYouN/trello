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
  const baord = await prisma.board.findFirst({
    where: {
      id,
    },
  });

  //Leaving this Here because we need to review out DB schema again, As board can be deleted bu a user who is admin or have admin permisions
};

export const getBoardsService = async (id: string) => {
  const boards = await prisma.board.findMany({
    where: {
      organisationId: id,
    },
  });

  return {
    boards,
  };
};

export const getBoardService = async (id: string) => {
  const board = await prisma.board.findFirst({
    where: {
      id,
    },
  });

  if (!board) {
    throw new Error("No board with this id exists");
  }
  return {
    board,
  };
};
