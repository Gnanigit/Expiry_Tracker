import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons"; // For delete icon
import { images } from "../constants";

const ProductCard = ({ image, name, expDate, status, onDelete, type }) => {
  const statusColors = {
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
  };

  return (
    <View
      className="flex-row bg-secondary-300 items-center justify-around rounded-2xl min-h-[100px] w-full  mb-2 p-0"
      style={{
        elevation: 3,
        borderWidth: 1,
        borderColor: "rgb(204, 169, 254)",
      }}
    >
      <Image
        source={image ? { uri: image } : images.thumbnail}
        className="w-12 h-12 rounded-xl m-0"
        resizeMode="cover"
      />

      <Text className="text-shadow-sm font-pregular  w-[180px] text-secondary">
        {name || "Product Name"}
      </Text>

      <Text className="text-sm font-pmdeium text-black-200 ">
        {expDate || "N/A"}
      </Text>
      {type === "history" && (
        <TouchableOpacity onPress={onDelete}>
          <FontAwesome name="trash" size={20} color="gray" />
        </TouchableOpacity>
      )}
      <View
        className={`w-5 h-5 m-0 rounded-full ${
          statusColors[status] || "bg-gray-500"
        }`}
      ></View>
    </View>
  );
};

export default ProductCard;
