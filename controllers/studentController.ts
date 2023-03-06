import { Request, Response } from "express";
import { ValidationError } from "sequelize";
const bcrypt = require("bcrypt");

import { Lecture } from "../models/lectureModel";
import { Student } from "../models/studentModel";

import { CustomRequest } from "../types";

import { StudentLecture } from "../models/studentLectureModel";

const checkInStudent = async (req: Request, res: Response) => {
  try {
    const { lectureId } = req.body;

    const [student, lecture] = await Promise.all([
      Student.findOne({
        where: {
          registrationNumber: (req as CustomRequest).token.registrationNumber,
        },
      }),
      Lecture.findByPk(lectureId),
    ]);

    const hasCheckedIn = await StudentLecture.findOne({
      where: {
        lectureId: lectureId,
        registrationNumber: student?.registrationNumber,
      },
    });

    if (hasCheckedIn) {
      return res
        .status(403)
        .send(`You have already checked in for ${lecture!.courseCode}`);
    } else {
      // Associate the student with the lecture by creating a new record in the student_lecture table
      await StudentLecture.create({
        fullName: student!.fullName,
        phoneNumber: student!.phoneNumber,
        registrationNumber: student!.registrationNumber,
        lectureId: lecture!.lectureId,
      });
    }

    if (!lecture!.isLectureValid()) {
      return res.status(403).send("Lecture is no longer valid");
    }

    const errors = [];

    if (!student) {
      errors.push("Student not found");
    }

    if (!lecture) {
      errors.push("Lecture not found");
    }

    if (errors.length > 0) {
      return res.status(409).send(errors);
    }

    res.send(`You have successfully checked in for ${lecture!.courseCode}`);
  } catch (error) {
    console.log("checkInError", error);
    res.status(500).send("Internal server error");
  }
};

const getAllStudents = async (req: Request, res: Response) => {
  try {
    const students = await Student.findAll();
    if (students) {
      return res.status(200).send(students);
    } else {
      return res.status(404).send("No students");
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      const errors = error.errors.map((err) => err.message);
      res.status(400).send(errors);
    }
    res.send(error);
  }
};

const getStudentInfo = async (req: Request, res: Response) => {
  try {
    const student = await Student.findOne({
      attributes: { exclude: ["pin", "updatedAt", "createdAt", "id"] },
      where: {
        registrationNumber: (req as CustomRequest).token.registrationNumber,
      },
      include: [
        {
          model: Lecture,
          attributes: ["courseCode", "courseName", "createdAt"],
          through: { attributes: [] },
        },
      ],
    });
    if (student) {
      return res.status(200).send(student);
    } else {
      return res.status(404).send("student not found");
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      const errors = error.errors.map((err) => err.message);
      res.status(400).send(errors);
    }
    res.send(error);
  }
};

const verifyPin = async (req: Request, res: Response) => {
  try {
    const { pin } = req.body;

    const student = await Student.findOne({
      where: {
        registrationNumber: (req as CustomRequest).token.registrationNumber,
      },
    });
    if (student) {
      const studentExist = await bcrypt.compare(pin, student.pin);

      if (studentExist) {
        return res.status(200).send("Valid pin");
      } else {
        return res.status(401).send("Invalid Details");
      }
    } else {
      return res.status(401).send("Invalid Details");
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      const errors = error.errors.map((err) => err.message);
      res.status(400).send(errors);
    }
    res.send(error);
  }
};

export { getAllStudents, getStudentInfo, verifyPin, checkInStudent };
