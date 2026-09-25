import { Request, Response } from "express";
import { getService } from "./user.services";

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = req.user;
  
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
  
    const result = await getService(user);
  
    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Get/Fetch User Error:", error);

    return res.status(401).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong while fetching user",
    });
  }
};

export const putMe = (req: Request, res: Response) => {};

export const deleteMe = (req: Request, res: Response) => {};

export const getOrganisations = (req: Request, res: Response) => {};

export const getBoards = (req: Request, res: Response) => {};
