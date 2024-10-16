import MaterialModel from "../Modals/MaterialModal.js";

export const onFetchStudentMaterials = async (req, res) => {
  const { courseName } = req.params;
  try {
    const materials = await MaterialModel.find({
      courseName,
    });
    res.status(200).json(materials);
  } catch (error) {
    console.log({ error: error.message, message: "student materials error" });
    return res.status(500).json({ message: "student materials error" });
  }
};
