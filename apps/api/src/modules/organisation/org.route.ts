
import { Router } from "express";
import { createOrganisation, deleteOrganisation, } from "./org.controller.ts";

const router = Router();

router.post("/create-organisation", createOrganisation);
router.delete("/delete-organisation/:id", deleteOrganisation);

export default router;