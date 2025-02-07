import { View, Text, ScrollView } from "react-native";
import React from "react";

const PriceComparison = () => {
  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: "center",
        marginTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 70,
      }}
    >
      <Text className="text-territory-100">Price Comparison</Text>
    </ScrollView>
  );
};

export default PriceComparison;
