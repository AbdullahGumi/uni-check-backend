import express, { Express } from "express";
const cookieParser = require("cookie-parser");
const cors = require("cors");

import studentRoutes from "./routes/studentRoutes";
import authRoutes from "./routes/authRoutes";
import lectureRoutes from "./routes/lectureRoutes";

import { connectToDatabase, sequelize } from "./util/db";
const { PORT } = require("./util/config");

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Expose-Headers", "Authorization");
  next();
});

app.use("/api/students", studentRoutes.router);
app.use("/api/auth", authRoutes.router);
app.use("/api/lectures", lectureRoutes.router);

const main = async () => {
  await connectToDatabase();
  await sequelize.sync({ alter: true });

  app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
  });
};

main();
