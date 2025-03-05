import React, { useState } from "react";
import { Text, Alert, FlatList, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../../components/ProductCard";
import { deleteProductById, deleteProducts } from "../../routes/product_api";
import {
  removeProduct,
  removeMultipleProducts,
} from "../../redux/slices/products";
import { setUser } from "../../redux/slices/auth";
import {
  removeNotification,
  removeMultipleNotifications,
} from "../../redux/slices/notify";
import { router } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const History = () => {
  const dispatch = useDispatch();
  const {
    items: products = [],
    loading,
    error,
  } = useSelector((state) => state.products);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const { theme } = useSelector((state) => state.theme);
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleLongPress = (id) => {
    if (!selectionMode) {
      setSelectionMode(true);
      setSelectedProducts([id]);
    }
  };

  const handleTap = (id) => {
    if (selectionMode) {
      const updatedSelection = selectedProducts.includes(id)
        ? selectedProducts.filter((todoId) => todoId !== id)
        : [...selectedProducts, id];

      setSelectedProducts(updatedSelection);
      if (updatedSelection.length === 0) {
        setSelectionMode(false);
      }
    }
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
              dispatch(removeNotification(id));
              dispatch(setUser(result.user));
              router.push("/history");
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

  const handleMultipleDelete = async () => {
    try {
      await deleteProducts(selectedProducts);
      dispatch(removeMultipleProducts(selectedProducts));
      dispatch(removeMultipleNotifications(selectedProducts));
      setSelectedProducts([]);
      setSelectionMode(false);
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to delete selected products. Please try again."
      );
    }
  };

  return (
    <SafeAreaView
      className={`${
        theme === "dark" ? "bg-primary-dark" : "bg-primary"
      } h-full`}
    >
      <Sidebar
        isVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
      />

      <Navbar toggleSidebar={toggleSidebar} />

      <Text className="text-lg text-shadow-sm text-center font-pbold text-territory-100">
        Your Purchases
      </Text>
      {loading && <Text>Loading...</Text>}
      {error && <Text>Error: {error}</Text>}
      <View className="mb-2 mt-1 flex-row justify-end items-center px-4 ">
        <TouchableOpacity
          onPress={handleMultipleDelete}
          disabled={selectedProducts.length === 0}
          className={`rounded-lg flex-row items-center justify-center`}
        >
          <FontAwesome
            name="trash"
            size={20}
            color={selectedProducts.length > 0 ? "red" : "gray"}
          />
          <Text
            className={`ml-2 ${
              selectedProducts.length > 0
                ? "text-red-500 text-[15px]"
                : "text-gray-500 text-[15px]"
            }`}
          >
            Delete Selected
          </Text>
        </TouchableOpacity>
      </View>
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
              onPress={() => handleTap(item._id)}
              isSelected={selectedProducts.includes(item._id)}
              onLongPress={() => handleLongPress(item._id)}
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
