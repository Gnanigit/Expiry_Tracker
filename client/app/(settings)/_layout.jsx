import React from "react";
import { Stack } from "expo-router";

const settingsLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="settings" options={{ headerShown: false }} />
      </Stack>
    </>
  );
};

export default settingsLayout;
