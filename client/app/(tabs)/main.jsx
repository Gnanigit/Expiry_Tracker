import React, { useEffect, useState } from "react";
import { View, Text, Alert, Image, FlatList, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import GetBarcode from "../../components/GetBarcode";
import FakeOrNot from "../../components/FakeOrNot";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useSelector } from "react-redux";

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
        return <Text>No component selected</Text>;
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full ">
      <Sidebar
        isVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
      />

      {/* Navbar */}
      <Navbar toggleSidebar={toggleSidebar} />
      {renderComponent()}
    </SafeAreaView>
  );
};

export default Main;
