import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import icons from "../constants/icons";
import { useSelector } from "react-redux";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  titleStyle,
  textStyles,
  inputViewStyle,
  icon,
  editable = true, // Default is editable
  ...props
}) => {
  const { theme } = useSelector((state) => state.theme);
  const [showPassword, setShowPassword] = useState(false);
  const isPincodeField = title.toLowerCase() === "pincode";
  const boxBackgroundColor =
    theme === "dark"
      ? "rgba(171, 150, 212, 0.12)"
      : "rgba(213, 195, 249, 0.12)";

  return (
    <View className={`${otherStyles}`}>
      <Text className={`${titleStyle}`}>{title}</Text>
      <View
        className={`${inputViewStyle} flex-row justify-center items-center space-x-2`}
        style={{ backgroundColor: boxBackgroundColor, borderWidth: 1.5 }}
      >
        <Image
          className="w-5 h-5"
          source={icon}
          tintColor="rgba(244, 159, 28, 1)"
        ></Image>
        <TextInput
          className={`flex-1 ${textStyles}`}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          keyboardType={isPincodeField ? "numeric" : "default"}
          maxLength={isPincodeField ? 6 : undefined}
          secureTextEntry={title === "Password" && showPassword}
          editable={editable}
        />
        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
            ></Image>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
