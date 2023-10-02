import express, { Router } from "express";

import {
  createLecture,
  getAllLectures,
  getLectureAttendace,
  getAllAdminLectures,
  deleteLectureAttendance,
} from "../controllers/lectureController";
import { validateToken } from "../middlewares/authentication";

const router: Router = express.Router();

router.get("/", validateToken("admin"), getAllLectures);
router.post("/create-lecture", validateToken("admin"), createLecture);
router.get("/my-lectures", validateToken("admin"), getAllAdminLectures);
router.delete(
  "/delete-lecture/:id",
  validateToken("admin"),
  deleteLectureAttendance
);
router.get("/attendance/:id", validateToken("admin"), getLectureAttendace);

export default { router };
