import { Model, DataType, Table, Column, HasMany } from "sequelize-typescript";
import { Lecture } from "./lectureModel";

interface AdminAttributes {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

@Table({
  tableName: "admin",
  timestamps: true,
})
class Admin extends Model<AdminAttributes> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fullName!: string;

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
  password!: string;

  @HasMany(() => Lecture, "adminId")
  lectures!: Lecture[];
}

export { Admin };
