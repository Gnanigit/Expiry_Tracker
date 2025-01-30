import React from "react";
import { Stack } from "expo-router";

const NotifyLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="notify" options={{ headerShown: false }} />
      </Stack>
    </>
  );
};

export default NotifyLayout;
