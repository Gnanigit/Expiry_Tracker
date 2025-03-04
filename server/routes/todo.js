import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { createTodo } from "../controllers/todo.js";

const TodoRouter = express.Router();

TodoRouter.post("/create-todo", authenticateUser, createTodo);

export default TodoRouter;
