import { Request, Response } from "express";
import { ValidationError } from "sequelize";
import { Admin } from "../models/adminModel";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

import { Student } from "../models/studentModel";
import { JWTP } from "../types";

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
      let token = jwt.sign(
        { registrationNumber: student.registrationNumber, role: "student" },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      ) as JWTP;

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
      const passwordMatches = await bcrypt.compare(pin, student.pin);

      if (passwordMatches) {
        let token = jwt.sign(
          { registrationNumber: student.registrationNumber, role: "student" },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        ) as JWTP;

        res.setHeader("Authorization", "Bearer " + token);

        return res.status(200).send({
          fullName: student.fullName,
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

const signupAdmin = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, phoneNumber } = req.body;
    const data = {
      fullName,
      email,
      phoneNumber,
      password: await bcrypt.hash(password, 10),
    };
    const admin = await Admin.create(data);

    if (admin) {
      let token = jwt.sign(
        { adminId: admin.id, role: "admin" },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      ) as JWTP;

      res.setHeader("Authorization", "Bearer " + token);

      return res.status(201).send({
        fullName: admin.fullName,
        email: admin.email,
        phoneNumber: admin.phoneNumber,
      });
    } else {
      return res.status(409).send("Could not create admin");
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      const errors = error.errors.map((err) => err.message);
      res.status(400).send(errors);
    }
    res.send(error);
  }
};

const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({
      where: {
        email,
      },
    });
    if (admin) {
      const passwordMatches = await bcrypt.compare(password, admin.password);

      if (passwordMatches) {
        let token = jwt.sign(
          { adminId: admin.id, role: "admin" },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        ) as JWTP;

        res.setHeader("Authorization", "Bearer " + token);

        return res.status(200).send({
          fullName: admin.fullName,
          email: admin.email,
          phoneNumber: admin.phoneNumber,
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

export { signup, login, signupAdmin, loginAdmin };
