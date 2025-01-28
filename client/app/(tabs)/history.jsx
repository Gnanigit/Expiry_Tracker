import React, { useState } from "react";
import { Text, Alert, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../../components/ProductCard";
import { deleteProductById } from "../../routes/product_api";
import { removeProduct } from "../../redux/slices/products";
import { getCurrentUser } from "../../routes/auth_api";
import { setUser } from "../../redux/slices/auth";

const History = () => {
  const dispatch = useDispatch();
  const {
    items: products = [],
    loading,
    error,
  } = useSelector((state) => state.products);

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Delete Confirmation",
      "Are you sure you want to delete this item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const result = await deleteProductById(id);
              dispatch(removeProduct(id));

              dispatch(setUser(result.user));
              Alert.alert("Success", "Product deleted successfully");
            } catch (error) {
              Alert.alert(
                "Error",
                error.message || "Failed to delete the product"
              );
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <Sidebar
        isVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
      />

      <Navbar toggleSidebar={toggleSidebar} />

      <Text className="text-lg text-shadow-sm text-center font-pbold text-territory-100 my-2">
        Your Purchases
      </Text>
      {loading && <Text>Loading...</Text>}
      {error && <Text>Error: {error}</Text>}

      {!loading && products.length > 0 ? (
        <FlatList
          className="px-2"
          data={products}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <ProductCard
              image={item.prodImage}
              name={item.name}
              expDate={item.expiryDate}
              status={item.status}
              onDelete={() => handleDelete(item._id)}
              type="history"
            />
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        !loading && (
          <Text className="text-center text-red-500 text-shadow-sm font-pregular w-full">
            No products available.
          </Text>
        )
      )}
    </SafeAreaView>
  );
};

export default History;
