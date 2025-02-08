import React from "react";
import { View, Text, Image, ScrollView } from "react-native";

const ItemCard = ({ item }) => {
  return (
    <View className="flex-row bg-white p-3 my-2 rounded-lg shadow-md border border-gray-200">
      <Image
        source={{ uri: item.productImage || "https://via.placeholder.com/150" }}
        className="w-24 h-24 rounded-lg mr-3"
        resizeMode="contain"
      />
      <View className="flex-1 justify-center">
        <Text className="text-sm font-bold mb-1" numberOfLines={2}>
          {item.actualName || "No Name Available"}
        </Text>
        <Text className="text-xs text-yellow-500 mb-1">
          ⭐ {item.rating || "N/A"}
        </Text>
        <View className="flex-row items-center">
          <Text className="text-green-600 text-sm font-bold">
            {item.currentPrice || "N/A"}
          </Text>
          {item.actualPrice && (
            <Text className="text-xs text-gray-500 line-through ml-2">
              {item.actualPrice}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const ItemProductList = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Text className="text-center text-gray-500 mt-4">No products found.</Text>
    );
  }

  return (
    <ScrollView className="w-full">
      {data.map((item, index) => (
        <ItemCard key={index.toString()} item={item} />
      ))}
    </ScrollView>
  );
};

export default ItemProductList;
