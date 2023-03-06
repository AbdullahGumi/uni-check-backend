import {
  Model,
  DataType,
  Table,
  Column,
  PrimaryKey,
  BelongsToMany,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Admin } from "./adminModel";
import { StudentLecture } from "./studentLectureModel";

import { Student } from "./studentModel";

interface LectureAttributes {
  lectureId?: string;
  courseName: string;
  courseCode: string;
  validityPeriod: string;
  adminId: number;
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

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  validityPeriod!: string;

  @ForeignKey(() => Admin)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  adminId!: number;

  @BelongsTo(() => Admin)
  admin!: Admin;

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
