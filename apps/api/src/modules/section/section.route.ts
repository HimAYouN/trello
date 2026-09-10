
import { Router } from "express";
import { deleteSection, getSection, postSection } from "./section.controller";


const router = Router();

router.post("/section", postSection);
router.get("/section", getSection)
router.delete("/section/:id", deleteSection)

export default router;