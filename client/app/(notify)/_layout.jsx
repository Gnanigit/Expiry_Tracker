import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

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
