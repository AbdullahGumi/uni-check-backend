import { Request, Response } from "express";
import { ValidationError } from "sequelize";

import { Lecture } from "../models/lectureModel";

const createLecture = async (req: Request, res: Response) => {
  try {
    const { courseName, courseCode } = req.body;
    const lecture = await Lecture.create({ courseName, courseCode });

    if (lecture) {
      return res.status(201).send({
        lectureId: lecture.id,
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

export { createLecture };
