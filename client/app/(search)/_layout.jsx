import React from "react";
import { Stack } from "expo-router";

const searchLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="search" options={{ headerShown: false }} />
      </Stack>
    </>
  );
};

export default searchLayout;
