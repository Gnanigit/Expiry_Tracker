import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons"; // For delete icon
import { images } from "../constants";

const ProductCard = ({ image, name, expDate, status, onDelete }) => {
  const statusColors = {
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
  };

  return (
    <View className="flex-row bg-secondary-300 items-center justify-around rounded-2xl min-h-[100px] w-full mt-2 p-0">
      <Image
        source={image ? { uri: image } : images.thumbnail}
        className="w-12 h-12 rounded-xl m-0"
        resizeMode="cover"
      />

      <View className="flex-row items-center h-full justify-center">
        <Text className="text-shadow-sm font-pregular max-w-[250px] text-secondary">
          {name || "Product Name"}
        </Text>
        <Text className="text-sm font-psemibold text-black-200 ml-2">
          {expDate || "N/A"}
        </Text>
      </View>

      {/* <TouchableOpacity onPress={onDelete}>
        <FontAwesome name="trash" size={20} color="gray" />
      </TouchableOpacity> */}

      <View
        className={`w-6 h-6 m-0 rounded-full ${
          statusColors[status] || "bg-gray-500"
        }`}
      ></View>
    </View>
  );
};

export default ProductCard;
