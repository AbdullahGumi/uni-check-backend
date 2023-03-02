import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

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

const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!, {
      ignoreExpiration: false,
    }) as JWTP;
    (req as CustomRequest).token = decoded;

    next();
  } catch (err) {
    res.status(401).send("Invalid Token");
  }
};

export { validateUser, validateToken };
