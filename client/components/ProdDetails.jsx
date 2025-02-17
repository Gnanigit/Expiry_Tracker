import { View, Text, ScrollView } from "react-native";
import React from "react";

const ProdDetails = () => {
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
      <Text className="text-territory-100">Product Details</Text>
    </ScrollView>
  );
};

export default ProdDetails;
