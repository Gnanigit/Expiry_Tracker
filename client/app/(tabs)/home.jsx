import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  return (
    <SafeAreaView className="bg-primary h-full pt-4">
      <View className="w-full items-center">
        <Text>This is Home</Text>
      </View>
    </SafeAreaView>
  );
};

export default Home;
