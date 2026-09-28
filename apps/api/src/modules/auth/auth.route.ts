
import { Router } from "express";
import { login, register } from "./auth.controller.ts";
import { validate } from "./auth.validate.ts";
import { loginSchema, registerSchema } from "../../schemas/user.schema.ts";

const router = Router();

router.post("/login", validate(loginSchema), login);
router.post("/register", validate(registerSchema), register)

export default router;