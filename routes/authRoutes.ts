import express, { Router } from "express";

import {
  signup,
  login,
  loginAdmin,
  signupAdmin,
} from "../controllers/authController";
import { validateAdmin, validateUser } from "../middlewares/authentication";

const router: Router = express.Router();

router.post("/signup", validateUser, signup);
router.post("/login", login);
router.post("/signup-admin", validateAdmin, signupAdmin);
router.post("/login-admin", loginAdmin);

export default { router };
