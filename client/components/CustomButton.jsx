import { TouchableOpacity, View, Text } from "react-native";
import React from "react";

const CustomButton = ({ title, handlePress, containerStyles, isLoading }) => {
  return (
    <TouchableOpacity
      style={{
        elevation: 2,
      }}
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-secondary-200 items-center justify-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
    >
      <Text className={`text-primary font-pmdeium text-lg`}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
