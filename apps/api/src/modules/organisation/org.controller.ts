import { Request, Response } from "express";
import {
  acceptService,
  createOrgService,
  deleteOrgService,
  inviteService,
} from "./org.services";

export const createOrganisation = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const id = req.user?.id;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Name and description are required",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "UserId is required",
      });
    }

    const result = await createOrgService(name, description, id);

    return res.status(200).json({
      success: true,
      message: "Organisation created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Create Organisation error:", error);

    return res.status(401).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong while creating organisation",
    });
  }
};

export const deleteOrganisation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { confirmation } = req.body;
    const userId = req.user?.id;

    if (!id || confirmation === undefined || !userId) {
      return res.status(400).json({
        success: false,
        message: "UserId, orgId and confirmation are required",
      });
    }

    const result = await deleteOrgService(id, confirmation, userId);

    return res.status(200).json({
      success: true,
      message: "Organisation deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error("Delete Organisation error:", error);

    return res.status(401).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong while deleting organisation",
    });
  }
};

export const inviteUser = async (req: Request, res: Response) => {
  try {
    const { organisationId } = req.params;
    const { email } = req.body;
    const userId = req.user?.id;

    if (!organisationId || !email || !userId) {
      return res.status(400).json({
        success: false,
        message: "UserId, orgId and email are required",
      });
    }

    const result = await inviteService(organisationId, email, userId);

    return res.status(200).json({
      success: true,
      message: "User invited to organisation.",
      data: result,
    });
  } catch (error) {
    console.error("Invite to Organisation error:", error);

    return res.status(401).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong while inviting user to organisation",
    });
  }
};

export const acceptOrganisation = async (req: Request, res: Response) => {
  try {
    const orgId = req.params.id;
    const { confirmation } = req.body;
    const userId = req.user?.id;

    if (!orgId || confirmation === undefined || !userId) {
      return res.status(400).json({
        success: false,
        message: "UserId, orgId and confirmation are required",
      });
    }

    const result = await acceptService(orgId, confirmation, userId);

    return res.status(200).json({
      success: true,
      message: "Organisation invite accepted successfully",
      data: result,
    });
  } catch (error) {
    console.error("Accept Organisation error:", error);

    return res.status(401).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong while accepting organisation invite request",
    });
  }
};
