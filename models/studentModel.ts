import { Optional } from "sequelize";
import {
  Model,
  DataType,
  Table,
  Column,
  BelongsToMany,
} from "sequelize-typescript";

import { Lecture } from "./lectureModel";
import { StudentLecture } from "./studentLectureModel";

interface StudentAttributes {
  fullName: string;
  registrationNumber: string;
  email: string;
  phoneNumber: string;
  pin: string;
}

@Table({
  tableName: "student",
  timestamps: true,
})
class Student extends Model<StudentAttributes> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fullName!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
    primaryKey: true,
  })
  registrationNumber!: string;

  @Column({
    type: DataType.STRING(120),
    unique: true,
    validate: {
      isEmail: {
        msg: "Must be a valid email address",
      },
    },
    allowNull: false,
  })
  email!: string;

  @Column({ type: DataType.STRING(14), allowNull: false, unique: true })
  phoneNumber!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  pin!: string;

  @BelongsToMany(
    () => Lecture,
    () => StudentLecture,
    "registrationNumber",
    "lectureId"
  )
  lectures!: Lecture[];
}

export { Student };
