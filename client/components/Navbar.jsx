import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";
import { router } from "expo-router";
import { useSelector } from "react-redux";

const Navbar = ({ toggleSidebar, type }) => {
  const { theme } = useSelector((state) => state.theme);
  const navigateToNotifications = () => {
    router.push("/notify");
  };
  const navigateToSearch = () => {
    router.push("/search");
  };

  const navigateToToDoList = () => {
    router.push("/todo");
  };

  const goBack = () => {
    router.back();
  };
  return (
    <View
      className={`flex-row justify-between h-[7%] items-center w-full ${
        theme === "dark" ? "bg-secondary-dark" : "bg-secondary"
      } px-4`}
    >
      {type === "notify" ? (
        <>
          <TouchableOpacity onPress={goBack}>
            <Image
              className="w-9 h-9"
              source={icons.leftArrow}
              resizeMode="contain"
              style={{ tintColor: "#CDCDE0" }}
            />
          </TouchableOpacity>
          <Text className="text-lg text-shadow-sm font-pbold text-xl text-gray-100">
            Notifications
          </Text>
          <TouchableOpacity onPress={navigateToNotifications}>
            <Image
              className="w-7 h-7"
              source={icons.notify}
              style={{ tintColor: "#F49F1C" }}
            />
          </TouchableOpacity>
        </>
      ) : type === "search" ? (
        <>
          <TouchableOpacity onPress={goBack}>
            <Image
              className="w-9 h-9"
              source={icons.leftArrow}
              resizeMode="contain"
              style={{ tintColor: "#CDCDE0" }}
            />
          </TouchableOpacity>
          <Text className="text-lg text-shadow-sm font-pbold text-xl text-gray-100">
            Search Products
          </Text>
          <TouchableOpacity onPress={navigateToNotifications}>
            <Image
              className="w-7 h-7"
              source={icons.notify}
              style={{ tintColor: "#F49F1C" }}
            />
          </TouchableOpacity>
        </>
      ) : type === "settings" ? (
        <>
          <TouchableOpacity onPress={goBack}>
            <Image
              className="w-9 h-9"
              source={icons.leftArrow}
              resizeMode="contain"
              style={{ tintColor: "#CDCDE0" }}
            />
          </TouchableOpacity>

          <Text className="text-lg text-shadow-sm font-pbold text-xl text-gray-100">
            Settings
          </Text>
          <TouchableOpacity onPress={navigateToNotifications}>
            <Image
              className="w-7 h-7"
              source={icons.notify}
              style={{ tintColor: "#F49F1C" }}
            />
          </TouchableOpacity>
        </>
      ) : type === "todo" ? (
        <>
          <TouchableOpacity onPress={goBack}>
            <Image
              className="w-9 h-9"
              source={icons.leftArrow}
              resizeMode="contain"
              style={{ tintColor: "#CDCDE0" }}
            />
          </TouchableOpacity>

          <Text className="text-lg text-shadow-sm font-pbold text-xl text-gray-100">
            Todo List
          </Text>
          <TouchableOpacity onPress={navigateToNotifications}>
            <Image
              className="w-7 h-7"
              source={icons.notify}
              style={{ tintColor: "#F49F1C" }}
            />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity onPress={toggleSidebar}>
            <Image
              className="w-9 h-9 "
              source={icons.menu}
              style={{ tintColor: "#CDCDE0" }}
            />
          </TouchableOpacity>
          <View className="flex-row justify-center items-center gap-4">
            <TouchableOpacity onPress={navigateToToDoList}>
              <Image
                className="w-5 h-5"
                source={icons.todo}
                // style={{ tintColor: "#F49F1C" }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={navigateToNotifications}>
              <Image
                className="w-7 h-7"
                source={icons.notify}
                style={{ tintColor: "#F49F1C" }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={navigateToSearch}>
              <Image
                className="w-6 h-6"
                source={icons.search}
                style={{ tintColor: "#CDCDE0" }}
              ></Image>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default Navbar;
