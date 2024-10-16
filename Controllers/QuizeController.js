import QuizeModal from "../Modals/QuizeModal.js";

export const onFetchAllQuizes = async (req, res) => {
  const { courseName } = req.params;

  try {
    const materials = await QuizeModal.find({
      courseName,
    });
    res.status(200).json(materials);
  } catch (error) {
    console.log({ error: error.message, message: "FetchAllQuizes failed" });
    return res
      .status(500)
      .json({ error: error.message, message: "FetchAllQuizes failed" });
  }
};
