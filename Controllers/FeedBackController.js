import UserModel from "../Modals/AuthModal.js";
import FeedBackModel from "../Modals/FeedbackModal.js";
import StudentFeedBack from "../Modals/StudentFeedBack.js";

export const onFetchFeedback = async (req, res) => {
  const { examId } = req.params;
  console.log(examId);
  try {
    const feedback = await FeedBackModel.findOne({ testUniqueId: examId });

    res.status(200).json(feedback);
  } catch (error) {
    console.log({ error: error.message, message: "Failed to fetch feedback" });
    return res.status(500).json({ message: "Failed to fetch feedback" });
  }
};

export const onPostFeedback = async (req, res) => {
  const { testId, email, feedBacks } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found..." });
    }
    const feedback = new StudentFeedBack({
      testId: testId,
      head: existingUser._id,
      feedBacks,
    });
    await feedback.save();
    res.status(201).json({ message: "Feedback saved successfully " });
  } catch (error) {
    console.log({ error: error.message, message: "Failed to post feedback" });
    return res.status(500).json({ message: "Failed to post feedback" });
  }
};
