import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Admin } from "../models/adminModel";

import { Student } from "../models/studentModel";
import { CustomRequest, JWTP } from "../types";

const validateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { phoneNumber, email, registrationNumber } = req.body;

  try {
    const [phoneNumberCheck, emailCheck, regNumberCheck] = await Promise.all([
      Student.findOne({ where: { phoneNumber } }),
      Student.findOne({ where: { email } }),
      Student.findOne({ where: { registrationNumber } }),
    ]);
    const errors = [];

    if (phoneNumberCheck) {
      errors.push(`PhoneNumber ${phoneNumber} already taken`);
    }
    if (emailCheck) {
      errors.push(`Email ${email} already taken`);
    }
    if (regNumberCheck) {
      errors.push(
        `An account was already registered with ${registrationNumber}`
      );
    }

    if (errors.length > 0) {
      return res.status(409).send(errors);
    }

    next();
  } catch (error) {
    return res.status(500).send(error);
  }
};

const validateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { phoneNumber, email, registrationNumber } = req.body;

  try {
    const [phoneNumberCheck, emailCheck] = await Promise.all([
      Admin.findOne({ where: { phoneNumber } }),
      Admin.findOne({ where: { email } }),
    ]);
    const errors = [];

    if (phoneNumberCheck) {
      errors.push(`PhoneNumber ${phoneNumber} already taken`);
    }
    if (emailCheck) {
      errors.push(`Email ${email} already taken`);
    }

    if (errors.length > 0) {
      return res.status(409).send(errors);
    }

    next();
  } catch (error) {
    return res.status(500).send(error);
  }
};

const validateToken =
  (requiredRole: "admin" | "student") =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        throw new Error();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!, {
        ignoreExpiration: false,
      }) as JWTP;
      (req as CustomRequest).token = decoded;

      if (decoded.role !== requiredRole) {
        throw new Error(
          "Access denied. You do not have the required role to access this resource."
        );
      }

      next();
    } catch (err: any) {
      res.status(401).send(err.message || "Invalid Token");
    }
  };

export { validateUser, validateToken, validateAdmin };
