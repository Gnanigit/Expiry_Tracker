import { View, Text, Image } from "react-native";
import React from "react";
import { icons } from "../constants";

const Navbar = () => {
  return (
    <View className="flex-row justify-between h-[7%] items-center w-full bg-secondary px-3">
      <Image
        className="w-9 h-9"
        source={icons.menu}
        style={{ tintColor: "#FFFFFF" }}
      />
      <Image
        className="w-6 h-6"
        source={icons.search}
        style={{ tintColor: "#FFFFFF" }}
      ></Image>
    </View>
  );
};

export default Navbar;
