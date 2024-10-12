import TodoModel from "../Modals/TodoModal.js";

export const onAddTodo = async (req, res) => {
  const { title, description } = req.body;
  const { user } = req;
  try {
    const todo = new TodoModel({ title, description, head: user._id });
    await todo.save();
    return res.status(201).json({ todo });
  } catch (error) {
    console.log({ error: error.message, message: "add todo failed" });
    return res
      .status(500)
      .json({ error: error.message, message: "add todo failed" });
  }
};

export const onFetchTodos = async (req, res) => {
  const { user } = req;
  try {
    const todos = await TodoModel.find({ head: user._id });
    return res.status(200).json(todos);
  } catch (error) {
    console.log({ error: error.message, message: "fetching todo failed" });
    return res
      .status(500)
      .json({ error: error.message, message: "fetching todo failed" });
  }
};

export const onMarkTodo = async (req, res) => {
  const { id } = req.params;
  try {
    const singleTodo = await TodoModel.findById(id);
    if (!singleTodo) {
      return res.status(404).json({ message: "todo not found" });
    }
    await TodoModel.findByIdAndUpdate(
      id,
      { $set: { isRead: !singleTodo.isRead } },
      { new: true }
    );
    return res.status(200).json({ message: "Todo Updated Succesfuully" });
  } catch (error) {
    console.log({ error: error.message, message: "mark todo failed" });
    return res
      .status(500)
      .json({ error: error.message, message: " mark todo failed " });
  }
};
