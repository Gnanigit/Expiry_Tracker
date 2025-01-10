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
const Home = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
        <View className="w-full px-3 bg-primary items-center">
          <View className="w-full px-1 items-start mt-1">
            <Text className="text-shadow-sm text-3xl font-medium text-territory-200">
              Welcome Back...
            </Text>
            <Text className=" text-shadow-sm text-3xl font-bold text-secondary-100">
              Gnani
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
              <Text className="text-shadow-sm text-[15px] font-bold text-white ml-1 max-w-[75%]">
                Add product
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-secondary-300 flex-row items-center rounded-2xl">
              <Image
                className="w-12 h-12 object-contain ml-1 shadow-lg"
                source={icons.fake}
              />
              <Text className="text-shadow-sm text-[15px] font-bold text-white ml-1 max-w-[75%]">
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
              <Text className="text-shadow-sm text-[15px] font-bold text-white ml-1 max-w-[75%]">
                Price comparison
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-secondary-300 flex-row items-center rounded-2xl">
              <Image
                className="w-12 h-12 object-contain ml-1 shadow-lg"
                source={icons.product}
              />
              <Text className="text-shadow-sm text-[15px] font-bold text-white max-w-[75%]">
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
