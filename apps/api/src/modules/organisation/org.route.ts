import { Router } from "express";
import {
  acceptOrganisation,
  createOrganisation,
  deleteOrganisation,
  inviteUser,
} from "./org.controller.ts";

const router = Router();

router.post("/organisation", createOrganisation);
router.delete("/organisation/:id", deleteOrganisation);

// router.post("/:organisationId/invite", inviteUser);
// router.post("/accept/:orgasationId", acceptOrganisation);

export default router;
