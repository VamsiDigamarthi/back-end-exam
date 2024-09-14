import UserModel from "../Modals/AuthModal.js";
import Question from "../Modals/QuestionModal.js";
import StudentExamModel from "../Modals/StudentExamModal.js";

export const onFetchExamDetails = async (req, res) => {
  const { sections, examId, email } = req.body;

  try {
    // Validate input
    if (!sections || !examId || !email) {
      return res
        .status(400)
        .json({ message: "Sections, examId, and email are required." });
    }

    // Check if user exists
    const existingUser = await UserModel.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found..." });
    }

    // Check if exam exists
    const existingExam = await StudentExamModel.findOne({
      _id: examId,
      "students.studentId": existingUser._id,
    });
    if (!existingExam) {
      return res.status(404).json({ message: "Exam not found..." });
    }

    // Find the specific student in the array
    const student = existingExam.students.find((stu) => stu.email === email);

    // Check if afterWritingExams has any value
    if (student.afterWritingExams && student.afterWritingExams.length > 0) {
      return res.status(400).json({
        message: "Your are already writing your Exam",
      });
    }

    // Array to store combined questions and section details (cutOff, totalMarks)
    let combinedSections = [];

    // Loop through each section's examId
    for (let sectionExamId of sections?.split(",")) {
      // Find questions related to the current section examId
      const sectionQuestions = await Question.find({
        examId: sectionExamId,
      });

      // Find the corresponding section details (cutOff and totalMarks) from the exam document
      const sectionDetails = existingExam.examsSections.find(
        (section) => section.examId === sectionExamId
      );

      if (!sectionDetails) {
        return res
          .status(404)
          .json({ message: `Section with examId ${sectionExamId} not found.` });
      }

      // Push the found questions and section details into the combinedSections array
      // console.log(sectionDetails);
      combinedSections.push({
        examId: sectionExamId,
        courseName: existingExam?.courseName,
        date: existingExam?.date,
        time: existingExam?.time,
        passKey: existingExam?.passKey,
        totalMarks: sectionDetails.totalMarks,
        cutOff: sectionDetails.cutOff,
        _id: sectionDetails._id,
        questions: sectionQuestions,
      });
    }

    // Send the combined questions and section details
    return res.status(200).json({
      //   message: "Questions and section details fetched successfully",
      sections: combinedSections,
    });
  } catch (error) {
    console.log({ error: error.message, message: "Finding exam failed...!" });
    return res.status(500).json({
      error: error.message,
      message: "Finding exam failed ",
    });
  }
};

export const onSubmittedData = async (req, res) => {
  const { email, exmDetails, examId } = req.body;
  console.log(email, exmDetails);

  try {
    const existingExam = await StudentExamModel.findOne({
      _id: examId,
      "students.email": email,
    });

    if (!existingExam) {
      return res.status(404).json({ message: "Exam or student not found" });
    }

    // Set the student's afterWritingExams field to the exmDetails value
    const updatedExam = await StudentExamModel.updateOne(
      {
        _id: examId,
        "students.email": email,
      },
      {
        $set: {
          "students.$.afterWritingExams": exmDetails, // Set the exam details as the new value of afterWritingExams
        },
      }
    );

    return res
      .status(200)
      .json({ message: "Exam details submitted successfully", updatedExam });
  } catch (error) {
    console.log({ error: error.message, message: " submission failed " });
    return res
      .status(500)
      .json({ error: error.message, message: "submission failed " });
  }
};
