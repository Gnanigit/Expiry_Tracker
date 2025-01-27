import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar from "../../components/Navbar";

const Notify = () => {
  return (
    <SafeAreaView className="bg-primary flex-1">
      <Navbar type={"notify"} />
      <View className="flex-1 items-center px-3 bg-primary py-3">
        {/* <Text className="text-lg text-shadow-sm font-pbold text-territory-100">
          Notifications
        </Text> */}
      </View>
    </SafeAreaView>
  );
};

export default Notify;
