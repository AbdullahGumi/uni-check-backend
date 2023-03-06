import { Model, Table, Column } from "sequelize-typescript";

interface StudentLectureAttributes {
  fullName: string;
  phoneNumber: string;
  registrationNumber: string;
  lectureId: string;
}

@Table({
  tableName: "student_lecture",
  timestamps: true,
})
class StudentLecture extends Model<StudentLectureAttributes> {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @Column
  fullName!: string;

  @Column
  phoneNumber!: string;

  @Column
  registrationNumber!: string;

  @Column
  lectureId!: string;
}

export { StudentLecture };
