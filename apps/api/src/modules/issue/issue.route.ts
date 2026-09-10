import { Router } from "express";
import { deleteIssue, getIssue, getIssues, postIssue } from "./issue.controller";


const router = Router()

router.post("/:sectionId/issue", postIssue)
router.get("/:sectionId/issues", getIssues)
router.get("/issue/:issueId", getIssue)
// router.put("/issue/:issueId")
router.delete("issue/issueId", deleteIssue)


export default router