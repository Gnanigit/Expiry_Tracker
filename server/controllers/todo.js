import Todo from "../models/Todo.js";

export const createTodo = async (req, res) => {
  try {
    const todoItems = req.body;

    if (!todoItems || !Array.isArray(todoItems) || todoItems.length === 0) {
      return res.status(400).json({ error: "Invalid todo list" });
    }
    const userId = req.user.userId;
    const todoDocs = todoItems.map((todo) => ({
      name: todo.name,
      weight: todo.weight,
      expiryDate: new Date(),
      userId,
    }));

    const savedTodos = await Todo.insertMany(todoDocs);

    res.status(201).json({ message: "Todos saved successfully", savedTodos });
  } catch (error) {
    console.error("Error saving todos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllTodos = async (req, res) => {
  try {
    const userId = req.user.userId;
    const todos = await Todo.find({ userId: userId });
    res.status(200).json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTodos = async (req, res) => {
  try {
    if (!todoIds || !Array.isArray(todoIds) || todoIds.length === 0) {
      return res.status(400).json({ message: "Invalid todo IDs" });
    }

    // Delete todos with matching IDs
    const result = await Todo.deleteMany({ _id: { $in: todoIds } });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No todos found to delete" });
    }

    return res.status(200).json({
      message: "Todos deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting todos:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
