import { Router } from "express";
import {
  registerEmployee,
  loginEmployee,
  logoutEmployee,
  getCurrentEmployee,
} from "../controllers/employee.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.route("/register").post(registerEmployee);
router.route("/login").post(loginEmployee);

// Protected routes
router.route("/logout").post(verifyJWT, logoutEmployee);
router.route("/me").get(verifyJWT, getCurrentEmployee);

export default router;
