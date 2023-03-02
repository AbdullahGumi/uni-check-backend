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
}

@Table({
  tableName: "lecture",
  timestamps: true,
})

// TODO: Add validity field that indicates how long lecture token is active
class Lecture extends Model<LectureAttributes> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  lectureId!: string;

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

  @BelongsToMany(() => Student, () => StudentLecture, "lectureId", "studentId")
  students!: Student[];
}

export { Lecture };
