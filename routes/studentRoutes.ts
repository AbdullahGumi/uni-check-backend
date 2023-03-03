import express, { Router } from "express";

import {
  getAllStudents,
  getStudentInfo,
  verifyPin,
  checkInStudent,
} from "../controllers/studentController";
import { validateToken } from "../middlewares/authentication";

const router: Router = express.Router();

router.get("/", validateToken("student"), getAllStudents);
router.get("/student-info", validateToken("student"), getStudentInfo);
router.post("/check-in", validateToken("student"), checkInStudent);
router.post("/verify-pin", validateToken("student"), verifyPin);

export default { router };
