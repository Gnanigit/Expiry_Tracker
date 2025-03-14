import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { images } from "../constants";
import { useSelector } from "react-redux";
import { icons } from "../constants";

const ProductCard = ({
  image,
  name,
  expDate,
  status,
  onDelete,
  type,
  isSelected,
  onLongPress,
  onPress,
}) => {
  const statusColors = {
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
  };

  const { theme } = useSelector((state) => state.theme);
  const backgroundColor = isSelected
    ? "rgba(255, 99, 71, 0.5)"
    : theme === "dark"
    ? "rgba(217, 202, 246, 0.19)"
    : "rgba(141, 80, 255, 0.34)";
  const borderColor =
    theme === "dark" ? "rgba(163, 121, 249, 0.39)" : "rgba(141, 80, 255, 0.59)";

  return (
    <TouchableOpacity
      onLongPress={onLongPress}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        className="flex-row items-center justify-around rounded-2xl min-h-[100px] w-full mb-2 p-0"
        style={{
          backgroundColor: backgroundColor,
          borderWidth: 1,
          borderColor: borderColor,
        }}
      >
        <Image
          source={image ? { uri: image } : images.cart}
          className="w-12 h-12 rounded-xl m-0"
          resizeMode="cover"
        />

        <Text
          className={`font-pregular  w-[180px] ${
            theme === "dark" ? "text-secondary-darkText" : "text-secondary"
          }`}
        >
          {name || "Product Name"}
        </Text>

        <Text
          className={`text-sm font-pmdeium ${
            theme === "dark" ? "text-gray-100" : "text-black-200"
          }`}
        >
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
    </TouchableOpacity>
  );
};

export default ProductCard;
