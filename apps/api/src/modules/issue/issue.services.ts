import { prisma } from "@repo/db";

export const postIssueSerivce = async (
  id: string,
  title: string,
  desc: string,
) => {
  const existingIssue = await prisma.issue.findFirst({
    where: {
      title,
      sectionId: id,
    },
  });

  if (existingIssue) {
    throw new Error("Issue with same title already exists");
  }

  const section = await prisma.section.findFirst({
    where: {
      id,
    },
  });

  if (!section) {
    throw new Error("Could not find the relative section");
  }

  const issue = await prisma.issue.create({
    data: {
      title,
      description: desc,
      boardId: section.boardId,
      sectionId: id,
    },
  });

  return {
    issue: {
      id: issue.id,
      title: issue.title,
      sectionId: issue.sectionId,
      description: issue.description,
      boardId: issue.boardId,
    },
  };
};

export const getIssuesService = async (id: string) => {
  const issues = await prisma.issue.findMany({
    where: {
      sectionId: id,
    },
  });

  return {
    issues,
  };
};

export const getIssueService = async (id: string) => {
  const issue = await prisma.issue.findFirst({
    where: {
      id,
    },
  });
  if (!issue) {
    throw new Error("Could not find the issue.");
  }

  return {
    issue: {
      id: issue.id,
      title: issue.title,
      sectionId: issue.sectionId,
      description: issue.description,
      boardId: issue.boardId,
      createdAt: issue.createdAt,
      updatedAt: issue.updatedAt,
    },
  };
};

export const deleteIssueService = async (id: string) => {
  //TODO So basically an issue can deleted by only admin or the mod of that org, board, so i need to look into this one.
  const issue = await prisma.issue.delete({
    where: {
      id,
    },
  });
  if (!issue) {
    throw new Error("Could not find the issue.");
  }
  return {
    issue: {
      id: issue.id,
      title: issue.title,
      sectionId: issue.sectionId,
      description: issue.description,
      boardId: issue.boardId,
    },
  };
};
