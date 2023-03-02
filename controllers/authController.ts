import { Request, Response } from "express";
import { ValidationError } from "sequelize";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

import { Student } from "../models/studentModel";

const signup = async (req: Request, res: Response) => {
  try {
    const { fullName, registrationNumber, email, pin, phoneNumber } = req.body;
    const data = {
      fullName,
      registrationNumber,
      email,
      phoneNumber,
      pin: await bcrypt.hash(pin, 10),
    };
    const student = await Student.create(data);

    if (student) {
      let token = jwt.sign({ id: student.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.setHeader("Authorization", "Bearer " + token);

      return res.status(201).send({
        fullName: student.fullName,
        registrationNumber: student.registrationNumber,
        email: student.email,
        phoneNumber: student.phoneNumber,
      });
    } else {
      return res.status(409).send("Could not create user");
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      const errors = error.errors.map((err) => err.message);
      res.status(400).send(errors);
    }
    res.send(error);
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { registrationNumber, pin } = req.body;

    const student = await Student.findOne({
      where: {
        registrationNumber,
      },
    });
    if (student) {
      const studentExist = await bcrypt.compare(pin, student.pin);

      if (studentExist) {
        let token = jwt.sign({ id: student.id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });

        res.setHeader("Authorization", "Bearer " + token);

        return res.status(200).send({
          fulll: student.fullName,
          registrationNumber: student.registrationNumber,
          email: student.email,
          phoneNumber: student.phoneNumber,
        });
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

export { signup, login };
