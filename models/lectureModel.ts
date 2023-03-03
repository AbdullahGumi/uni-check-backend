import {
  Model,
  DataType,
  Table,
  Column,
  PrimaryKey,
  BelongsToMany,
} from "sequelize-typescript";
import { StudentLecture } from "./studentLectureModel";

import { Student } from "./studentModel";

interface LectureAttributes {
  courseName: string;
  courseCode: string;
  validityPeriod: string;
}

@Table({
  tableName: "lecture",
  timestamps: true,
})
class Lecture extends Model<LectureAttributes> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  lectureId!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  courseName!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  courseCode!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  validityPeriod!: string;

  @BelongsToMany(
    () => Student,
    () => StudentLecture,
    "lectureId",
    "registrationNumber"
  )
  students!: Student[];

  isLectureValid(): boolean {
    const now = new Date().toISOString();
    return now <= this.validityPeriod;
  }
}

export { Lecture };
