import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface CustomRequest extends Request {
  token: JwtPayload;
}

export interface JWTP extends JwtPayload {
  role: "admin" | "student";
  registrationNumber: string;
  adminId: string;
}
