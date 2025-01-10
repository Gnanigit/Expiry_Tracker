import React, { useEffect, useState } from "react";
import { View, Text, Alert, Image, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import GetBarcode from "../../components/GetBarcode";
import FakeOrNot from "../../components/FakeOrNot";

const Main = () => {
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
    <View className="flex-1 bg-white items-center justify-center">
      {renderComponent()}
    </View>
  );
};

export default Main;
