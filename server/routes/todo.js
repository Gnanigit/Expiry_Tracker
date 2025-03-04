import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { createTodo, getAllTodos } from "../controllers/todo.js";

const TodoRouter = express.Router();

TodoRouter.post("/create-todo", authenticateUser, createTodo);

TodoRouter.get("/all-todos", authenticateUser, getAllTodos);

export default TodoRouter;
