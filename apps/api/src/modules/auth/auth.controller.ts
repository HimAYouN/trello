import { Request, Response } from "express";
import { loginService, registerService } from "./auth.services.ts";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "Name, Email and password are required",
      });
    }

    const result = await registerService(email, password, name);

    return res.status(200).json({
      success: true,
      message: "Register successful",
      data: result,
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(401).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Something went wrong while registering user",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await loginService(email, password);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(401).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Invalid email or password",
    });
  }
};
