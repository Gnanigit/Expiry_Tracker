import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Checkbox from "expo-checkbox";

const TodoCard = ({ name, weight, date }) => {
  const [isChecked, setChecked] = useState(false);

  return (
    <View
      className="w-full flex-row justify-between item-center p-4"
      style={{
        elevation: 2,
        backgroundColor: "rgb(244, 244, 244)",
        borderColor: "#ddd",
        borderWidth: 0.2,
        borderRadius: 5,
        shadowColor: "#000",
      }}
    >
      <View className="flex-row items-center w-[60%] h-[100%] justify-between">
        <Text>{name}</Text>
        <Text>{weight}</Text>
      </View>
      <View className="flex-row items-center justify-between w-[30%]">
        <Text className="text-gray">{date}</Text>
        <Checkbox
          className="p-0 m-0"
          value={isChecked}
          onValueChange={setChecked}
        />
      </View>
    </View>
  );
};

export default TodoCard;
