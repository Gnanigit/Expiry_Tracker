import { View, Text } from "react-native";
import React from "react";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";

const Todo = () => {
  const { theme } = useSelector((state) => state.theme);
  return (
    <SafeAreaView
      className={`${
        theme === "dark" ? "bg-primary-dark" : "bg-primary"
      } flex-1`}
    >
      <Navbar type={"todo"} />
      <Text>Todo</Text>
    </SafeAreaView>
  );
};

export default Todo;
