import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "../../constants";
import { router } from "expo-router";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useSelector } from "react-redux";

const Home = () => {
  const { isLogged, user } = useSelector((state) => state.auth);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };
  return (
    <SafeAreaView className="bg-primary flex-1 h-full">
      <Sidebar
        isVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
      />

      {/* Navbar */}
      <Navbar toggleSidebar={toggleSidebar} />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="w-full px-3 bg-primary items-center">
          <View className="w-full px-1 items-start mt-1">
            <Text className="text-shadow-sm text-3xl font-pmedium text-territory-200">
              Welcome Back...
            </Text>
            <Text className=" text-shadow-sm text-3xl font-psemibold text-secondary-100">
              {user?.username}
            </Text>
          </View>

          <View className="w-full flex-row justify-center gap-x-2 mt-3 min-h-[80px]">
            <TouchableOpacity
              className="flex-1 bg-secondary-300 flex-row items-center rounded-2xl"
              onPress={() =>
                router.push({
                  pathname: "/main",
                  params: { component: "ComponentA" },
                })
              }
            >
              <Image
                className="w-12 h-12 object-contain ml-1"
                source={icons.cart}
              />
              <Text className="text-shadow-sm text-[15px] font-psemibold text-white ml-1 max-w-[75%]">
                Add product
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-secondary-300 flex-row items-center rounded-2xl">
              <Image
                className="w-12 h-12 object-contain ml-1 shadow-lg"
                source={icons.fake}
              />
              <Text className="text-shadow-sm text-[15px] font-psemibold  text-white ml-1 max-w-[75%]">
                Fake Product Detection
              </Text>
            </TouchableOpacity>
          </View>

          <View className="w-full flex-row justify-center mt-3 gap-x-2  min-h-[80px] mb-5">
            <TouchableOpacity className="flex-1 bg-secondary-300 flex-row items-center rounded-2xl">
              <Image
                className="w-12 h-12 object-contain shadow-lg"
                source={icons.price}
              />
              <Text className="text-shadow-sm text-[15px] font-psemibold  text-white ml-1 max-w-[75%]">
                Price comparison
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-secondary-300 flex-row items-center rounded-2xl">
              <Image
                className="w-12 h-12 object-contain ml-1 shadow-lg"
                source={icons.product}
              />
              <Text className="text-shadow-sm text-[15px] font-psemibold  text-white max-w-[75%]">
                Product Details
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          className="w-full h-full bg-primary-100 py-5 px-3 items-center"
          style={{
            borderTopLeftRadius: 35,
            borderTopRightRadius: 35,
            elevation: 2,
          }}
        >
          <Text>Ready to Expire</Text>
        </View>

        <StatusBar backgroundColor="#5E35B1" style="light" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
