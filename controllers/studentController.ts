import { Request, Response } from "express";
import { ValidationError } from "sequelize";
const bcrypt = require("bcrypt");

import { Lecture } from "../models/lectureModel";
import { Student } from "../models/studentModel";

import { CustomRequest } from "../types";

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
        id: (req as CustomRequest).token.id,
      },
      include: {
        model: Lecture,
      },
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
        id: (req as CustomRequest).token.id,
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

export { getAllStudents, getStudentInfo, verifyPin };
