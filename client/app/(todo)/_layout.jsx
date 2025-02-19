import React from "react";
import { Stack } from "expo-router";

const todoLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="todo" options={{ headerShown: false }} />
      </Stack>
    </>
  );
};

export default todoLayout;
