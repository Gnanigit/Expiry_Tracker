import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";
import Sidebar from "./Sidebar";
const Navbar = ({ toggleSidebar }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  return (
    <View className="flex-row justify-between h-[7%] items-center w-full bg-secondary px-3">
      <TouchableOpacity onPress={toggleSidebar}>
        <Image
          className="w-9 h-9"
          source={icons.menu}
          style={{ tintColor: "#FFFFFF" }}
        />
      </TouchableOpacity>
      <Image
        className="w-6 h-6"
        source={icons.search}
        style={{ tintColor: "#FFFFFF" }}
      ></Image>
    </View>
  );
};

export default Navbar;
