import React from "react";
import { Stack } from "expo-router";

const TodoLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="todo" options={{ headerShown: false }} />
      <Stack.Screen name="create" options={{ headerShown: false }} />
    </Stack>
  );
};

export default TodoLayout;
