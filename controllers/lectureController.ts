import { Request, Response } from "express";
import { ValidationError } from "sequelize";

import { Lecture } from "../models/lectureModel";
import { StudentLecture } from "../models/studentLectureModel";

const createLecture = async (req: Request, res: Response) => {
  try {
    const { courseName, courseCode } = req.body;
    const lecture = await Lecture.create({ courseName, courseCode });
    if (lecture) {
      return res.status(201).send({
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
      return res.status(404).send("lecture not found");
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      const errors = error.errors.map((err) => err.message);
      res.status(400).send(errors);
    }
    res.send(error);
  }
};
export { createLecture, getAllLectures, getLectureAttendace };
