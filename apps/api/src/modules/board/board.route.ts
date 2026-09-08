import { Router } from "express";
import {
  board,
  boards,
  createBoard,
  deleteBoard,
  editBoard,
} from "./board.controller";

const router = Router();

router.post("/:organisationId/board", createBoard);
router.delete("/board/:id", deleteBoard);

router.get("/:organisationId/boards", boards);
router.get("/board/:id", board);

// router.put("/board/:id", editBoard)

export default router;
