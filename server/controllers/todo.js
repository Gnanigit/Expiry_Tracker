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
