import express, { Router } from "express";

import {
  getAllStudents,
  getStudentInfo,
  verifyPin,
} from "../controllers/studentController";
import { validateToken } from "../middlewares/authentication";

const router: Router = express.Router();

router.get("/", validateToken, getAllStudents);
router.get("/student-info", validateToken, getStudentInfo);
router.get("/check-in", validateToken, getStudentInfo);
router.post("/verify-pin", validateToken, verifyPin);

export default { router };
