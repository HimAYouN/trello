import { prisma } from "@repo/db";

export const postSectionService = async (boardId: string, title: string) => {
  const existingSection = await prisma.section.findFirst({
    where: {
      boardId,
    },
  });

  if (existingSection) {
    throw new Error("Section with same name already exists");
  }

  const section = await prisma.section.create({
    data: {
      title,
      boardId,
    },
  });

  return {
    section: {
      title: section.title,
      boardId: section.boardId,
    },
  };
};

export const deleteSectionService = async (sectionId: string) => {
  const existingSection = await prisma.section.findFirst({
    where: {
      id: sectionId,
    },
  });

  if (!existingSection) {
    throw new Error("Section does not exists");
  }

  const section = await prisma.section.delete({
    where: {
      id: sectionId,
    },
  });

  return {
    section: {
      id: section.id,
      title: section.title,
      boardId: section.boardId,
    },
  };
};



export const getSectionService = async (id: string) =>{
    const board = await prisma.board.findFirst({
    where: {
      id,
    },
  });

  if (!board) {
    throw new Error("Board does not exists");
  }

  const section = await prisma.section.findMany({
    where: {
      boardId: id,
    },
  });

  return {
    section: {
      section,
    },
  };
}