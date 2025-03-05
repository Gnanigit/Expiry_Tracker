import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import Checkbox from "expo-checkbox";

const TodoCard = ({ name, weight, date, isSelected, onLongPress, onPress }) => {
  const { theme } = useSelector((state) => state.theme);
  const [isChecked, setChecked] = useState(false);
  const backgroundColor = isSelected
    ? "rgba(255, 99, 71, 0.5)"
    : theme === "dark"
    ? "rgba(217, 202, 246, 0.19)"
    : "rgba(141, 80, 255, 0.34)";
  const borderColor =
    theme === "dark" ? "rgba(163, 121, 249, 0.39)" : "rgba(141, 80, 255, 0.59)";

  return (
    <TouchableOpacity
      onLongPress={onLongPress}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        className="flex-row items-center justify-between rounded-xl w-full mb-2 px-2 py-4 border"
        style={{
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 1,
          borderRadius: 5,
          shadowColor: "#000",
        }}
      >
        <View className="flex-1 flex-row items-center justify-between">
          <Text
            className={`font-pregular truncate w-[40%] ${
              theme === "dark" ? "text-secondary-darkText" : "text-secondary"
            }`}
          >
            {name}
          </Text>
          <Text
            className={`text-sm font-medium w-[20%] text-center ${
              theme === "dark" ? "text-gray-100" : "text-black-200"
            }`}
          >
            {weight}
          </Text>
          <Text
            className={`text-[12px] font-medium w-[20%] text-center ${
              theme === "dark" ? "text-gray-200" : "text-black-300"
            }`}
          >
            {date}
          </Text>
          <Checkbox
            value={isChecked}
            onValueChange={setChecked}
            color={
              isChecked ? "rgba(244, 159, 28, 1)" : "rgba(244, 159, 28, 1)"
            }
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TodoCard;
