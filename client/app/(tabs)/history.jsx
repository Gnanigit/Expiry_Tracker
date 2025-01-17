import React, { useEffect, useState } from "react";
import { View, Text, Alert, Image, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../../components/ProductCard";

const History = () => {
  const {
    items: products = [],
    loading,
    error,
  } = useSelector((state) => state.products);

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };
  return (
    <SafeAreaView className="bg-primary h-full ">
      <Sidebar
        isVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
      />

      <Navbar toggleSidebar={toggleSidebar} />
      <View className="w-full items-center">
        <Text className="text-lg text-shadow-sm font-pbold text-territory-100 mt-3">
          Your Purchases
        </Text>
        {loading && <Text>Loading...</Text>}
        {error && <Text>Error: {error}</Text>}

        {!loading && products.length > 0 ? (
          <FlatList
            data={products}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <ProductCard
                image={item.prodImage}
                name={item.name}
                expDate={item.expiryDate}
                status={item.status}
              />
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          !loading && <Text>No products available.</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default History;
