import { Request, Response } from "express";
import {
  deleteSectionService,
  getSectionService,
  postSectionService,
} from "./section.services";

export const postSection = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params;
    const title = req.body.title;

    if (!boardId || !title) {
      return res.status(400).json({
        success: false,
        message: "Board Id and title are required",
      });
    }

    const result = await postSectionService(boardId, title);

    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      data: result,
    });
  } catch (error) {
    console.error("postSection error:", error);

    return res.status(401).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong while making a section",
    });
  }
};

export const deleteSection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Section Id is required",
      });
    }

    const result = await deleteSectionService(id);

    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error("delete section error:", error);

    return res.status(401).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong while deleting a section",
    });
  }
};

export const getSection = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params;

    if (!boardId) {
      return res.status(400).json({
        success: false,
        message: "Board Id is required",
      });
    }

    const result = await getSectionService(boardId);

    return res.status(200).json({
      success: true,
      message: "Sections fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("get section error:", error);

    return res.status(401).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong while fetching section",
    });
  }
};

