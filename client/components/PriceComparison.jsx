import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useSelector } from "react-redux";

const platforms = [
  { id: "amazon", name: "Amazon" },
  { id: "flipkart", name: "Flipkart" },
  { id: "tata1mg", name: "Tata 1mg" },
  { id: "apollo", name: "Apollo" },
  { id: "netmeds", name: "Netmeds" },
  { id: "pharmeasy", name: "Pharmeasy" },
  { id: "bigbasket", name: "BigBasket" },
  { id: "grofers", name: "Grofers" },
  { id: "myntra", name: "Myntra" },
  { id: "ajio", name: "Ajio" },
];

const productData = {
  amazon: [
    { id: "1", name: "Product A - Amazon" },
    { id: "2", name: "Product B - Amazon" },
  ],
  flipkart: [
    { id: "3", name: "Product A - Flipkart" },
    { id: "4", name: "Product B - Flipkart" },
  ],
  tata1mg: [
    { id: "5", name: "Product A - Tata 1mg" },
    { id: "6", name: "Product B - Tata 1mg" },
  ],
  apollo: [
    { id: "7", name: "Product A - Apollo" },
    { id: "8", name: "Product B - Apollo" },
  ],
  netmeds: [
    { id: "9", name: "Product A - Netmeds" },
    { id: "10", name: "Product B - Netmeds" },
  ],
  pharmeasy: [
    { id: "11", name: "Product A - Pharmeasy" },
    { id: "12", name: "Product B - Pharmeasy" },
  ],
  bigbasket: [
    { id: "13", name: "Product A - BigBasket" },
    { id: "14", name: "Product B - BigBasket" },
  ],
  grofers: [
    { id: "15", name: "Product A - Grofers" },
    { id: "16", name: "Product B - Grofers" },
  ],
  myntra: [
    { id: "17", name: "Product A - Myntra" },
    { id: "18", name: "Product B - Myntra" },
  ],
  ajio: [
    { id: "19", name: "Product A - Ajio" },
    { id: "20", name: "Product B - Ajio" },
  ],
};

const PriceComparison = () => {
  const [selectedPlatform, setSelectedPlatform] = useState("amazon");
  const { theme } = useSelector((state) => state.theme);

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
      <Text className="text-territory-100 mb-4">Price Comparison</Text>

      <FlatList
        data={platforms}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          gap: 10,
          paddingHorizontal: 5,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedPlatform(item.id)}
            className={`py-3 px-4 `}
            style={{
              backgroundColor:
                selectedPlatform === item.id
                  ? "rgba(244, 159, 28, 1)"
                  : theme === "dark"
                  ? "rgba(217, 202, 246, 0.19)"
                  : "rgba(88, 88, 88, 0.27)",
              borderRadius: 20,
              minWidth: 80,
              alignItems: "center",
            }}
          >
            <Text
              className={`${
                selectedPlatform === item.id
                  ? "text-primary"
                  : "text-secondary-100"
              } ${
                selectedPlatform === item.id ? "font-pbold" : "font-psemibold"
              }`}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        snapToInterval={100}
        decelerationRate="fast"
        maxToRenderPerBatch={4}
      />

      {/* Product List */}
      <View style={{ marginTop: 20, width: "100%", paddingHorizontal: 10 }}>
        {productData[selectedPlatform].map((product) => (
          <View
            key={product.id}
            style={{
              backgroundColor: "#f1f1f1",
              padding: 15,
              marginVertical: 5,
              borderRadius: 10,
            }}
          >
            <Text>{product.name}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default PriceComparison;
