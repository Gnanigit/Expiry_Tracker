import React, { useEffect, useState } from "react";
import { View, Text, Alert, Image, FlatList, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import GetBarcode from "../../components/GetBarcode";
import FakeOrNot from "../../components/FakeOrNot";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useSelector } from "react-redux";
import MainComponents from "../../components/MainComponents";
const Main = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };
  const { component } = useLocalSearchParams();
  const renderComponent = () => {
    switch (component) {
      case "ComponentA":
        return <GetBarcode />;
      case "ComponentB":
        return <FakeOrNot />;

      default:
        return (
          <View className="items-center h-full w-full mt-5">
            <Text className="text-shadow-sm text-center text-2xl font-pbold text-territory-100 w-[250px] mb-60">
              Tap & Select Any of Our{" "}
              <Text className="text-secondary-100">Power</Text> Features
            </Text>
            <MainComponents />
          </View>
        );
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <Sidebar
        isVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
      />

      <Navbar toggleSidebar={toggleSidebar} />
      <View>{renderComponent()}</View>
    </SafeAreaView>
  );
};

export default Main;
