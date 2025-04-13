import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define("User", {

  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  registration_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  date_of_birth: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("student", "admin"),
    defaultValue: "student",
  },
}, {
  tableName: "Users",
  timestamps: true,
  underscored: true, 
});

export default User;
