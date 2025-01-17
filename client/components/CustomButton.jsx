import { TouchableOpacity, View, Text, Image } from "react-native";
import React from "react";
import icons from "../constants/icons";
const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  isLoading,
  type,
}) => {
  return (
    <TouchableOpacity
      style={{
        elevation: 2,
      }}
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-secondary-200 items-center justify-center flex-row ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
    >
      {type === "google" && (
        <Image className="w-[24px] h-[24px] mr-5" source={icons.google} />
      )}
      {type === "email" && (
        <Image className="w-[24px] h-[24px] mr-5" source={icons.email} />
      )}

      <Text className={`text-primary font-pmdeium text-lg`}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
