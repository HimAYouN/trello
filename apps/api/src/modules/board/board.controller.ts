import { Request, Response } from "express";
import {
  createBoardService,
  deleteBoardService,
  getBoardService,
  getBoardsService,
} from "./board.services";


export const createBoard = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    const { organisationId } = req.params.organisationId;

    if (!title || !organisationId) {
      return res.status(400).json({
        success: false,
        message: "Title and organisationId is required",
      });
    }

    const result = await createBoardService(title, organisationId);

    return res.status(200).json({
      success: true,
      message: "Board created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Create Board Error:", error);

    return res.status(401).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong while Creating board",
    });
  }
};


export const deleteBoard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params.id;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }
    const result = await deleteBoardService(id);

    return res.status(200).json({
      success: true,
      message: "Board deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error("Delete Board Error:", error);

    return res.status(401).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong while Deleting the board",
    });
  }
};


export const boards = async (req: Request, res: Response) => {
  try {
    const { organisationId } = req.params.organisationId;
    if (!organisationId) {
      return res.status(400).json({
        success: false,
        message: "Organisation is required",
      });
    }
    const result = await getBoardsService(organisationId);
    return res.status(200).json({
      success: true,
      message: "Boards fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Get all boards Error:", error);

    return res.status(401).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong while Fetching all boards",
    });
  }
};


export const board = async (req: Request, res: Response) => {
  try {
    const {id} = req.params.id
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const result = await getBoardService(id)

    return res.status(200).json({
      success: true,
      message: "Boards fetched successfully",
      data: result,
    });

  } catch (error) {
    console.error("Get board Error:", error);

    return res.status(401).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong while Fetching a board",
    });
  }
};


export const editBoard = async (req: Request, res: Response) => {};
