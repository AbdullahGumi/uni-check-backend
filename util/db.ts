import { Sequelize } from "sequelize-typescript";

import { Admin } from "../models/adminModel";
import { Lecture } from "../models/lectureModel";
import { StudentLecture } from "../models/studentLectureModel";
import { Student } from "../models/studentModel";

const { DATABASE_URL_DEVELOPMENT } = require("./config");

const sequelize = new Sequelize(DATABASE_URL_DEVELOPMENT, {
  models: [Admin, Student, Lecture, StudentLecture],
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();

    console.log("database connected ✅");
  } catch (err) {
    console.log("connecting database failed ❌");
    console.log(JSON.stringify(err));
    return process.exit(1);
  }

  return null;
};

export { connectToDatabase, sequelize };
