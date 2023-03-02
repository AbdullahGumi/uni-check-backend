import { Model, Table, Column } from "sequelize-typescript";

interface StudentLectureAttributes {
  id: number;
  fullName: string;
  registrationNumber: string;
  email: string;
  phoneNumber: string;
  pin: string;
}

@Table({
  tableName: "student_lecture",
  timestamps: true,
})
class StudentLecture extends Model<StudentLectureAttributes> {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @Column
  studentId!: number;

  @Column
  lectureId!: number;
}

export { StudentLecture };
