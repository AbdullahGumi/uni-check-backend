import express, { Router } from "express";

import { createLecture } from "../controllers/lectureController";
import { validateToken } from "../middlewares/authentication";

const router: Router = express.Router();

router.post("/create-lecture", validateToken, createLecture);

export default { router };
