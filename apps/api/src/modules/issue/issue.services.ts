import { prisma } from "@repo/db";

export const postIssueService = async (
  sectionId: string,
  title: string,
  desc: string,
) => {
  const existingIssue = await prisma.issue.findFirst({
    where: {
      title,
      sectionId,
    },
  });

  if (existingIssue) {
    throw new Error("Issue with same title already exists");
  }

  const section = await prisma.section.findUnique({
    where: {
      id: sectionId,
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
      sectionId,
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

export const postIssueSerivce = postIssueService;

export const getIssuesService = async (sectionId: string) => {
  const issues = await prisma.issue.findMany({
    where: {
      sectionId,
    },
  });

  return {
    issues,
  };
};

export const getIssueService = async (id: string) => {
  const issue = await prisma.issue.findUnique({
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
  const issue = await prisma.issue.findUnique({
    where: { id },
  });

  if (!issue) {
    throw new Error("Could not find the issue.");
  }

  const deletedIssue = await prisma.issue.delete({
    where: {
      id,
    },
  });

  return {
    issue: {
      id: deletedIssue.id,
      title: deletedIssue.title,
      sectionId: deletedIssue.sectionId,
      description: deletedIssue.description,
      boardId: deletedIssue.boardId,
    },
  };
};
