
import { Router } from "express";
import { deleteSection, getSection, postSection } from "./section.controller";


const router = Router();

router.post("/:boardId/section", postSection);
router.get("/:boardId/section", getSection)
router.delete("/section/:id", deleteSection)

// router.put("/section/:sectionId", putSection)


export default router;