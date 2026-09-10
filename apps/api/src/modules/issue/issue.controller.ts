import { Request, Response } from "express";
import { deleteIssueService, getIssueService, getIssuesService, postIssueSerivce } from "./issue.services";

export const postIssue = async (req: Request, res: Response) => {
  try {
    const { sectionId } = req.params.sectionId;
    const { title, desc } = req.body;

    if (!sectionId) {
      return res.status(400).json({
        success: false,
        message: "section Id is required",
      });
    }
    if (!title) {
      return res.status(400).json({
        success: false,

        message: "Title is required",
      });
    }

    const result = await postIssueSerivce(sectionId, title, desc);

    return res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: result,
    });
  } catch (error) {
    console.error("createIssue error:", error);

    return res.status(401).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong while creating a new issue",
    });
  }
};

export const getIssues = async (req: Request, res: Response) => {
  try {
    const  {sectionId}  = req.params.sectionId;

    if (!sectionId) {
      return res.status(400).json({
        success: false,
        message: "section Id is required",
      });
    }

    const result = await getIssuesService(sectionId);

    return res.status(201).json({
      success: true,
      message: "Issues fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("getIssues error:", error);

    return res.status(401).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong while fetching the  issues",
    });
  }
};

export const getIssue = async (req: Request, res: Response) => {
  try {
    const {issueId} = req.params.issueId
    if (!issueId) {
      return res.status(400).json({
        success: false,
        message: "Issue Id is required",
      });
    }

    const result = await getIssueService(issueId)

    return res.status(201).json({
      success: true,
      message: "Issue fetched successfully",
      data: result,
    });


    
  } catch (error) {
    console.error("getIssue error:", error);

    return res.status(401).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong while fetching one issue",
    });
  }
};


export const deleteIssue = async (req: Request, res: Response) => {
  try {
    const {issueId} = req.params.issueId
    if (!issueId) {
      return res.status(400).json({
        success: false,
        message: "Issue Id is required",
      });
    }

    const result = await deleteIssueService(issueId)

    return res.status(201).json({
      success: true,
      message: "Issue deleted successfully",
      data: result,
    });


    
  } catch (error) {
    console.error("deleteIssue error:", error);

    return res.status(401).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong while deleting issue",
    });
  }
};