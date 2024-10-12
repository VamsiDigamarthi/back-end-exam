import express from "express";
import cors from "cors";
import http from "http";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import "dotenv/config";
import AuthRoute from "./Routes/AuthRoute.js";
import AdminRoute from "./Routes/AdminRoute.js";
import Question from "./Modals/QuestionModal.js";
import Exam from "./Routes/ExamRoute.js";
import Todo from "./Routes/TodoRoute.js";
import FeedBack from "./Routes/FeedBackRoute.js";

const app = express();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  })
);

app.use(express.json());
// app.use("/uploads", express.static("uploads"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const server = http.createServer(app);

mongoose
  .connect(process.env.MONGO_DB)
  .then(() =>
    server.listen(process.env.PORT, () =>
      console.log(`App Listening at ${process.env.PORT}`)
    )
  )
  .catch((error) => console.log(error));

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Welcome to Exam Server......!" });
});

app.use("/auth", AuthRoute);
app.use("/admin", AdminRoute);

app.use("/exam", Exam);

app.use("/todo", Todo);

app.use("/feedback", FeedBack);

app.patch("/add-examId", async (req, res) => {
  const { level, courseName } = req.body;

  try {
    await Question.updateMany(
      { courseName: courseName },
      { $set: { level: level } },
      { multi: true }
    );
    return res.status(200).json({ message: "Exam ID updated successfully" });
  } catch (error) {
    console.log("exma id failed");
  }
});
