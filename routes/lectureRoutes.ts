import express, { Router } from "express";

import {
  createLecture,
  getAllLectures,
  getLectureAttendace,
} from "../controllers/lectureController";
import { validateToken } from "../middlewares/authentication";

const router: Router = express.Router();

router.get("/", validateToken("admin"), getAllLectures);
router.post("/create-lecture", validateToken("admin"), createLecture);
router.get("/attendace", validateToken("admin"), getLectureAttendace);

export default { router };
