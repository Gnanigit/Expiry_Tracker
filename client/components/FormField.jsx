import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
// import { icons } from "../constants";
const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View className={`${otherStyles} space-y-0.5`}>
      <Text className="text-base text-black-100 font-pmedium">{title}</Text>
      <View className="w-full bg-primary border-2 px-4 h-14 border-gray-300 rounded-2xl focus:border-secondary flex flex-row items-center">
        <TextInput
          className="flex-1 text-black-100 text-base font-pmedium"
          value={value}
          z
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && showPassword}
        />
        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {/* <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
            ></Image> */}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
