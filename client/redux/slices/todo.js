// slices/todo.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  todos: [],
};

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    addTodo: (state, action) => {
      state.todos.push(action.payload);
    },
    setTodos: (state, action) => {
      state.todos = action.payload;
    },
    clearTodos: (state) => {
      state.todos = [];
    },
    removeTodos: (state, action) => {
      state.todos = state.todos.filter(
        (todo) => !action.payload.includes(todo._id)
      );
    },
  },
});

export const { addTodo, setTodos, clearTodos, removeTodos } = todoSlice.actions;
export default todoSlice.reducer;
