import React from "react";
import { Tabs } from "expo-router";
import { View, Text, Image } from "react-native";
import { icons } from "../../constants";
import { useSelector } from "react-redux";
const TabIcon = ({ icon, name, color, focused }) => (
  <View className="items-center justify-center w-20">
    <Image
      source={icon}
      tintColor={color}
      className="w-6 h-6"
      resizeMode="contain"
    />
    <Text
      className={`${focused ? "font-psemibold" : "font-pregular"} text-[10px]`}
      style={{ color: color }}
    >
      {name}
    </Text>
  </View>
);

const TabsLayout = () => {
  const { theme } = useSelector((state) => state.theme);
  const backgroundColors =
    theme === "dark" ? "rgba(31, 23, 49, 1)" : "rgba(94, 53, 177, 1)";
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#F49F1C",
        tabBarInactiveTintColor: "#CDCDE0",
        tabBarStyle: {
          backgroundColor: backgroundColors,
          borderTopWidth: 0.5,
          borderTopColor: "#232533",
          height: 60,
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.home}
              color={color}
              name="Home"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.history}
              color={color}
              name="History"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="main"
        options={{
          title: "Power",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.main}
              color={color}
              name="Power"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.profile}
              color={color}
              name="Profile"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
