import { Router } from "express";
import {
  getMe,
  putMe,
  deleteMe,
  getOrganisations,
  getBoards,
} from "./user.controller";

const router = Router();

router.get("/me", getMe);
router.put("/me", putMe);
router.delete("/me", deleteMe);

router.get("/me/organisation", getOrganisations);
router.get("/me/boards", getBoards);

export default router;
