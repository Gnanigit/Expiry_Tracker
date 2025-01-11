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
    <View className="flex-row bg-secondary-300 items-center justify-around rounded-2xl min-h-[70px] w-full mt-2">
      <Image
        source={image ? { uri: image } : images.thumbnail}
        className="w-12 h-12 rounded-xl"
        resizeMode="cover"
      />

      <View className="flex-row items-center justify-center h-full gap-x-5">
        <Text className="text-shadow-sm text-lg font-bold text-secondary">
          {name || "Unknown Product"}
        </Text>
        <Text className="text-sm font-bold text-black-200">
          Exp: {expDate || "N/A"}
        </Text>
      </View>

      <TouchableOpacity onPress={onDelete}>
        <FontAwesome name="trash" size={20} color="gray" />
      </TouchableOpacity>

      <View
        className={`w-6 h-6 rounded-full ${
          statusColors[status] || "bg-gray-500"
        } mr-4`}
      ></View>
    </View>
  );
};

export default ProductCard;
