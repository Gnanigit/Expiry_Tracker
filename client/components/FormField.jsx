import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import icons from "../constants/icons";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  titleStyle,
  textStyles,
  inputViewStyle,
  editable = true, // Default is editable
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPincodeField = title.toLowerCase() === "pincode";

  return (
    <View className={`${otherStyles}`}>
      <Text className={`${titleStyle}`}>{title}</Text>
      <View
        className={`${inputViewStyle}`}
        // style={{
        //   borderWidth: 1.1,
        //   borderColor: "#6b7280",
        //   borderRadius: 12,
        // }}
      >
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
