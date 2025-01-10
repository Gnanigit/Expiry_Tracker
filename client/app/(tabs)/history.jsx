import React, { useEffect, useState } from "react";
import { View, Text, Alert, Image, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const History = () => {
  return (
    <SafeAreaView className="bg-primary h-full pt-4">
      <View className="w-full items-center">
        <Text>History</Text>
      </View>
    </SafeAreaView>
  );
};

export default History;
