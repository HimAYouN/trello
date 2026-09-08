import { Request, Response } from "express";
import { createOrgService, deleteOrgService } from "./org.services";

export const createOrganisation = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    if (!name || !description || !userId) {
      return res.status(400).json({
        success: false,
        message: "UserId, Name and description are required",
      });
    }

    const result = await createOrgService(name, description, userId);

    return res.status(200).json({
      success: true,
      message: "Organisation created successful",
      data: result,
    });
  } catch (error) {
    console.error("Create Organisation error:", error);

    return res.status(401).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong while Creating Organisation",
    });
  }
};

export const deleteOrganisation = async (req: Request, res: Response) => {
  try {
    const orgId = req.params.id;
    const { confirmation } = req.body;
    const userId = req.user.id;

    if (!orgId || !confirmation || !userId) {
      return res.status(400).json({
        success: false,
        message: "UserId, orgId and confirmation are required",
      });
    }

    const result = await deleteOrgService(orgId, confirmation, userId);
    return res.status(200).json({
      success: true,
      message: "Organisation created successful",
      data: result,
    });
  } catch (error) {
    console.error("Delete Organisation error:", error);

    return res.status(401).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong while deleting Organisation",
    });
  }
};
