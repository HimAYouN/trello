
import { Router } from "express";
import { createOrganisation, deleteOrganisation, } from "./org.controller.ts";

const router = Router();

router.post("/organisation", createOrganisation);
router.delete("/organisation/:id", deleteOrganisation);

export default router;