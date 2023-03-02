import express, { Router } from "express";

import { signup, login } from "../controllers/authController";
import { validateUser } from "../middlewares/authentication";

const router: Router = express.Router();

router.post("/signup", validateUser, signup);
router.post("/login", login);

export default { router };
