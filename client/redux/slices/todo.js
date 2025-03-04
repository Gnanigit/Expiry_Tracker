// slices/todo.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  todos: [],
};

const todoSlice = createSlice({
  name: "todo", // This should match the state key
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
  },
});

export const { addTodo, setTodos, clearTodos } = todoSlice.actions;
export default todoSlice.reducer; // This should match store.js
