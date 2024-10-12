import UserModel from "../Modals/AuthModal.js";
import FeedBackModel from "../Modals/FeedbackModal.js";
import Question from "../Modals/QuestionModal.js";
import StudentExamModel from "../Modals/StudentExamModal.js";
import nodemailer from "nodemailer";
export const onAddStudent = async (req, res) => {
  const { studentDataExel } = req.body;

  try {
    const results = [];

    for (let student of studentDataExel) {
      let existingUser = await UserModel.findOne({ email: student.email });

      if (!existingUser) {
        const newUser = new UserModel({
          name: student.name,
          email: student.email,
          password: student.password,
          studentId: student.id,
          collegeName: student.collegeName,
          role: "student",
          course: student.course,
          batchName: student.batchName, // batchId
          purpose: student.purpose,
        });

        const savedUser = await newUser.save();
        results.push(savedUser);
      } else {
        console.log(`User with email ${student.email} already exists.`);
      }
    }

    return res.status(201).json({ message: "Users processed.", results });
  } catch (error) {
    console.error("Add student error:", error);
    return res
      .status(500)
      .json({ message: "Add student error: " + error.message });
  }
};

export const onAddQuestion = async (req, res) => {
  const { completeQuestion } = req.body;

  try {
    if (!Array.isArray(completeQuestion)) {
      return res.status(400).json({ message: "Invalid data format" });
    }

    let transformedArray = completeQuestion?.map((obj) => {
      let { option1, option2, option3, option4, option5, ...rest } = obj; // Destructuring to remove "email"
      // console.log(option1, option2, option3, option4, option5);
      return {
        ...rest,
        answers: [option1, option2, option3, option4, option5].filter(Boolean),
      };
    });
    // console.log(transformedArray);
    const questions = await Question.insertMany(transformedArray);

    return res
      .status(201)
      .json({ message: "Questions added successfully", data: questions });
  } catch (error) {
    console.log({ message: "Add student error: " + error.message });
    return res
      .status(500)
      .json({ message: "Add question error: " + error.message });
  }
};

export const onFetchAllBatchWiseStudent = async (req, res) => {
  try {
    const groupedUsers = await UserModel.aggregate([
      {
        $match: { role: { $ne: "admin" } }, // Exclude users with role "admin"
      },
      {
        $group: {
          _id: { course: "$course", batchName: "$batchName" },
          users: {
            $push: {
              _id: "$_id",
              name: "$name",
              email: "$email",
              studentId: "$studentId",
              // role: "$role",
              collegeName: "$collegeName",
              // createdAt: "$createdAt",
              // updatedAt: "$updatedAt",
            },
          },
        },
      },
      {
        $sort: { "_id.course": 1, "_id.batchName": 1 }, // Optional sorting
      },
      {
        $project: {
          _id: 0, // Exclude _id from the response
          course: "$_id.course",
          batchName: "$_id.batchName",
          users: 1,
        },
      },
    ]);

    res.status(200).json(groupedUsers);
  } catch (error) {
    console.log({
      error: error.message,
      message: "Allbatchwise fetching student failed..!",
    });
    return res
      .status(500)
      .json({ message: "Allbatchwise fetching student failed..!" });
  }
};

export const onFetchAllExamSections = async (req, res) => {
  try {
    const examIdGoup = await Question.aggregate([
      {
        $group: {
          _id: {
            courseName: "$courseName",
            examId: "$examId",
            topic: "$topic",
            level: "$level",
          },
          examsSections: {
            $push: {
              _id: "$_id",
              question: "$question",
              answers: "$answers",
              CorrectAnswer: "$CorrectAnswer",
              DefaultMarks: "$DefaultMarks",
              DefaultTimeToSolve: "$DefaultTimeToSolve",
              Difficulty_Level: "$Difficulty_Level",
              QuestionType: "$QuestionType",
              question: "$question",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          courseName: "$_id.courseName",
          examId: "$_id.examId",
          topic: "$_id.topic",
          level: "$_id.level",
          examsSections: 1,
        },
      },
    ]);
    res.status(200).json(examIdGoup);
  } catch (error) {
    console.log({
      error: error.message,
      message: "Failed to fetch all exam sections ",
    });
    return res.status(500).json({
      error: error.message,
      message: "Failed to fetch all exam sections",
    });
  }
};

const sendEmails = async (
  user,
  courseName,
  dateAndTime,
  time,
  passkey,
  examUrl
) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com", // Hostinger's SMTP server
    port: 465, // Secure SMTP port
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // console.log("if block exicuted");
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `Your ${courseName} Exam Has Been Scheduled Successfully!`,
    text: `Dear ${user?.name}
                We are excited to inform you that your exam for ${courseName} has been scheduled successfully. Here are the important details you need to know:

                Exam Details:
                  Subject: ${courseName}
             
                  Date: ${dateAndTime}
                  Time: ${time}

                 passKey : ${passkey}
                Exam Link: <a href=${examUrl}>Start Exam</a>
        
                Thank you for choosing our services, and we wish you the best of luck on your ${courseName} exam!
                Best Regards,
                DHARANI
                NUHVIN GLOBAL SERVICES PRIVATE LIMITES 
                
             `,
    html: `<div>
                  <h2>Dear ${user?.name}</h2>
                  <p>We are excited to inform you that your exam for ${courseName} has been scheduled successfully. Here are the important details you need to know: </p>
                  <h3> Exam Details:</h3>
                  <ul>
                    <li>Subject: ${courseName}</li>
               
                    <li>Date: ${dateAndTime}</li>
                    <li>Time: ${time}</li>
                  
                  </ul>

                  <h3>passKey: ${passkey}</h3>
                   <p>Exam Link: <a href=${examUrl}>Start Exam</a></p>
                  <p>Thank you for choosing our services, and we wish you the best of luck on your ${courseName} exam!</p>
                  <p>Best regards,</p>
                  <h4>
                     DHARANI
                  </h4>
                  <h4>
                      NUHVIN GLOBAL SERVICES PRIVATE LIMITES 
                  </h4>
             </div>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${user.email}`);
  } catch (error) {
    console.error(`Failed to send email to ${user.email}: ${error.message}`);
  }
};

export const onAddExams = async (req, res) => {
  const {
    testId,
    batchName,
    courseName,
    date,
    time,
    passKey,
    purpose,
    examsSections,
    students,
    resultType,
    level,
    description,
  } = req.body;
  try {
    const docs = {
      testId,
      batchName,
      courseName,
      date,
      time,
      passKey,
      purpose,
      resultType,
      level,
      description,
      examsSections: examsSections,
      students: students,
      // head: user._id,
      // headOfOrganization: user.head,
    };
    // console.log(docs);
    const newExam = new StudentExamModel(docs);
    await newExam.save();
    students.map(async (obj) => {
      // const user = await UserModel.findOne({ _id: obj.studentId });
      // console.log(user);
      const sectionIds = examsSections
        .map((section) => section.examId)
        .join(",");
      const examUrl = `http://localhost:3000/exam-instructions/${newExam._id}/?sections=${sectionIds}`;

      sendEmails(obj, courseName, date, time, passKey, examUrl);
    });
    res.status(201).json({ message: "Exam added successfully" });
  } catch (error) {
    console.log({
      error: error.message,
      message: "Failed to add exam section ",
    });
    return res
      .status(500)
      .json({ error: error.message, message: "Failed to add exam section" });
  }
};

export const onFetchAllResults = async (req, res) => {
  try {
    const result = await StudentExamModel.find({});
    // .populate("studentId", "name studentId")
    // .populate("examId", "courseName");
    res.status(200).json(result);
  } catch (error) {
    console.log({
      error: error.message,
      message: "Failed to fetch all results",
    });
    return res
      .status(500)
      .json({ error: error.message, message: "Failed to fetch all results" });
  }
};

// add feedbacks

export const onAddFeedBacks = async (req, res) => {
  const { user } = req;
  const { testId, course, testUniqueId, feedbackQuestions } = req.body;

  let transformedArray = feedbackQuestions?.map((obj) => {
    let {
      feedbackoptionone,
      feedbackoptionsecond,
      feedbackoptionthird,
      feedbackoptionfouth,
      ...rest
    } = obj; // Destructuring to remove "email"
    return {
      ...rest,
      options: [
        feedbackoptionone,
        feedbackoptionsecond,
        feedbackoptionthird,
        feedbackoptionfouth,
      ],
    }; // Adding "city" field
  });

  const doc = {
    testId,
    course,
    testUniqueId,
    author: user._id,
    feedbackQuestions: transformedArray,
  };

  try {
    const newFeedback = new FeedBackModel(doc);
    await newFeedback.save();
    res.status(201).json({ message: "Feedback added successfully" });
  } catch (error) {
    console.log({ error: error.message, message: "Failed to add feedback" });
    return res
      .status(500)
      .json({ error: error.message, message: "Failed to add feedback" });
  }
};
