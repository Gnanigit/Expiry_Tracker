import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Checkbox from "expo-checkbox";
import { useSelector } from "react-redux";

const TodoCard = ({ name, weight, date }) => {
  const [isChecked, setChecked] = useState(false);
  const { theme } = useSelector((state) => state.theme);
  const backgroundColor =
    theme === "dark" ? "rgba(217, 202, 246, 0.19)" : "rgba(141, 80, 255, 0.34)";
  const borderColor =
    theme === "dark" ? "rgba(163, 121, 249, 0.39)" : "rgba(141, 80, 255, 0.59)";
  return (
    <View
      className="w-full flex-row justify-between item-center p-4 mt-1 mb-1"
      style={{
        backgroundColor: backgroundColor,
        borderColor: borderColor,

        borderWidth: 1,
        borderRadius: 5,
        shadowColor: "#000",
      }}
    >
      <View className="flex-row items-center w-[60%] justify-between">
        <Text
          className={`font-pregular  w-[180px] ${
            theme === "dark" ? "text-secondary-darkText" : "text-secondary"
          }`}
        >
          {name}
        </Text>
        <Text
          className={`text-sm font-pmdeium ${
            theme === "dark" ? "text-gray-100" : "text-black-200"
          }`}
        >
          {weight}
        </Text>
      </View>
      <View className="flex-row items-center justify-between w-[30%]">
        <Text
          className={`text-[12px] font-pmedium ${
            theme === "dark" ? "text-gray-200" : "text-black-300"
          }`}
        >
          {date}
        </Text>
        <Checkbox value={isChecked} onValueChange={setChecked} />
      </View>
    </View>
  );
};

export default TodoCard;
