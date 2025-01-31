import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";

const Notify = () => {
  const { theme } = useSelector((state) => state.theme);
  return (
    <SafeAreaView
      className={`${theme === "dark" ? "bg-black" : "bg-primary"} flex-1`}
    >
      <Navbar type={"notify"} />
      <View className="flex-1 items-center px-3 py-3"></View>
    </SafeAreaView>
  );
};

export default Notify;
