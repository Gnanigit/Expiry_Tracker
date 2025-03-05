import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { createTodo, getAllTodos, deleteTodos } from "../controllers/todo.js";

const TodoRouter = express.Router();

TodoRouter.post("/create-todo", authenticateUser, createTodo);

TodoRouter.get("/all-todos", authenticateUser, getAllTodos);

TodoRouter.delete("/delete", authenticateUser, deleteTodos);

export default TodoRouter;
