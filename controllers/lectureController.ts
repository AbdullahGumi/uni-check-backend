import { Request, Response } from "express";
import { ValidationError } from "sequelize";

import { Lecture } from "../models/lectureModel";
import { StudentLecture } from "../models/studentLectureModel";
import { CustomRequest } from "../types";

const createLecture = async (req: Request, res: Response) => {
  try {
    const { courseName, courseCode, validityPeriod } = req.body;
    const lecture = await Lecture.create({
      courseName,
      courseCode,
      validityPeriod,
      adminId: Number((req as CustomRequest).token.adminId),
    });
    if (lecture) {
      return res.status(201).send({
        adminId: (req as CustomRequest).token.adminId,
        lectureId: lecture.lectureId,
        courseName: lecture.courseName,
        courseCode: lecture.courseCode,
      });
    } else {
      return res.status(409).send("Could not create a lecture");
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      const errors = error.errors.map((err) => err.message);
      res.status(400).send(errors);
    }
    res.send(error);
  }
};

const getAllLectures = async (req: Request, res: Response) => {
  try {
    const lectures = await Lecture.findAll();
    if (lectures) {
      return res.status(200).send(lectures);
    } else {
      return res.status(404).send("No lectures");
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      const errors = error.errors.map((err) => err.message);
      res.status(400).send(errors);
    }
    res.send(error);
  }
};

const getAllAdminLectures = async (req: Request, res: Response) => {
  try {
    const lectures = await Lecture.findAll({
      attributes: { exclude: ["createdAt", "updatedAt", "validityPeriod"] },
      where: {
        adminId: Number((req as CustomRequest).token.adminId),
      },
    });
    if (lectures) {
      return res.status(200).send(lectures);
    } else {
      return res.status(404).send("No lectures");
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      const errors = error.errors.map((err) => err.message);
      res.status(400).send(errors);
    }
    res.send(error);
  }
};

const getLectureAttendace = async (req: Request, res: Response) => {
  const { lectureId } = req.body;
  try {
    const lecture = await StudentLecture.findAll({
      attributes: { exclude: ["updatedAt", "createdAt", "id"] },
      where: {
        lectureId,
      },
    });
    if (lecture) {
      return res.status(200).send(lecture);
    } else {
      return res.status(404).send("attendance not found");
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      const errors = error.errors.map((err) => err.message);
      res.status(400).send(errors);
    }
    res.send(error);
  }
};

const deleteLectureByAdminId = async (req: Request, res: Response) => {
  const lectureId = req.params.id;

  try {
    const lecture = await Lecture.findOne({
      where: {
        lectureId,
        adminId: Number((req as CustomRequest).token.adminId),
      },
    });

    if (!lecture) {
      return res.status(404).send("Lecture not found");
    }

    await lecture.destroy();

    return res.status(204).send();
  } catch (error: any) {
    return res.status(500).send(error.message);
  }
};
export {
  createLecture,
  getAllLectures,
  getLectureAttendace,
  getAllAdminLectures,
  deleteLectureByAdminId,
};
