import { Router } from "express";
import {
  acceptOrganisation,
  createOrganisation,
  deleteOrganisation,
  getOrganisation,
  getOrganisations,
  inviteUser,
} from "./org.controller.ts";

const router = Router();

router.post("/organisation", createOrganisation);
router.get("/organisation", getOrganisations);
router.get("/organisation/:id", getOrganisation);
router.delete("/organisation/:id", deleteOrganisation);

// router.post("/:organisationId/invite", inviteUser);
// router.post("/accept/:orgasationId", acceptOrganisation);

export default router;
