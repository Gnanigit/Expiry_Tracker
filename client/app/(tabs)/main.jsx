import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, RefreshControl, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import GetBarcode from "../../components/GetBarcode";
import FakeOrNot from "../../components/FakeOrNot";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import MainComponents from "../../components/MainComponents";
import { icons } from "../../constants";
import { useSelector } from "react-redux";

const Main = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const { theme } = useSelector((state) => state.theme);
  const { component: paramComponent, unique } = useLocalSearchParams();
  const [component, setComponent] = useState(paramComponent || null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setComponent(null);
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (paramComponent && unique) {
      setComponent(paramComponent);
    }
  }, [paramComponent, unique]);

  const renderComponent = () => {
    switch (component) {
      case "ComponentA":
        return (
          <ScrollView
            className={`${
              theme === "dark" ? "bg-primary-dark" : "bg-primary"
            } h-full`}
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
            className={`${
              theme === "dark" ? "bg-primary-dark" : "bg-primary"
            } h-full`}
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
          <SafeAreaView
            className={`${
              theme === "dark" ? "bg-primary-dark" : "bg-primary"
            } h-full`}
          >
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
              <View className="mb-60 relative w-[250px]">
                <Text className="text-shadow-sm text-center text-xl font-psemibold text-territory-100">
                  Tap & Select Any of Our{" "}
                  <Text
                    className={`${
                      theme === "dark"
                        ? "text-secondary-darkText"
                        : "text-secondary"
                    }`}
                  >
                    Power
                  </Text>{" "}
                  Features
                </Text>
                <Image
                  source={icons.main}
                  className="w-7 h-7 absolute right-3 bottom-0"
                />
              </View>

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
