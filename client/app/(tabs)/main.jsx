import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useLocalSearchParams } from "expo-router";
import GetBarcode from "../../components/GetBarcode";
import FakeOrNot from "../../components/FakeOrNot";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import MainComponents from "../../components/MainComponents";

const Main = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const { component: paramComponent, unique } = useLocalSearchParams();
  const [component, setComponent] = useState(paramComponent || null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setComponent(null); // Reset to default component
    setIsRefreshing(false); // Stop refreshing indicator
  };

  useEffect(() => {
    // Update component when paramComponent or unique identifier changes
    if (paramComponent && unique) {
      setComponent(paramComponent);
    }
  }, [paramComponent, unique]);

  const renderComponent = () => {
    switch (component) {
      case "ComponentA":
        return (
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
          >
            <GetBarcode />
          </ScrollView>
        );
      case "ComponentB":
        return (
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
          >
            <FakeOrNot />
          </ScrollView>
        );
      default:
        return (
          <SafeAreaView className="bg-primary h-full">
            <ScrollView
              contentContainerStyle={{
                alignItems: "center",
                justifyContent: "center",
              }}
              className="flex-1"
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={onRefresh}
                  tintColor="#000"
                />
              }
            >
              <Text className="text-shadow-sm text-center text-2xl font-pbold text-territory-100 w-[250px] mb-60">
                Tap & Select Any of Our{" "}
                <Text className="text-secondary-100">Power</Text> Features
              </Text>
              <MainComponents />
            </ScrollView>
          </SafeAreaView>
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
