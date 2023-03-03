import { Model, Table, Column } from "sequelize-typescript";

interface StudentLectureAttributes {
  registrationNumber: string;
  lectureId: number;
}

@Table({
  tableName: "student_lecture",
  timestamps: true,
})
class StudentLecture extends Model<StudentLectureAttributes> {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @Column
  registrationNumber!: string;

  @Column
  lectureId!: number;
}

export { StudentLecture };
