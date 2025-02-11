import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Button,
  Image,
} from "react-native";
import { useSelector } from "react-redux";
import BarcodeScanner from "./BarcodeScanner";
import { priceComparison } from "../routes/product_api";
import ItemProductList from "./ItemProductList";
import SearchInput from "./SearchInput";
import { icons } from "../constants";

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
const PriceComparison = () => {
  const [selectedPlatform, setSelectedPlatform] = useState("amazon");
  const [scannedProduct, setScannedProduct] = useState(null);
  const { theme } = useSelector((state) => state.theme);
  const [amazonProduct, setAmazonProduct] = useState([]);
  const [flipkartProduct, setFlipkartProduct] = useState([]);
  const [showScanner, setShowScanner] = useState(false);

  const platformProducts = {
    amazon: amazonProduct,
    flipkart: flipkartProduct,
    tata1mg: [],
    apollo: [],
    netmeds: [],
    pharmeasy: [],
    bigbasket: [],
    grofers: [],
    myntra: [],
    ajio: [],
  };

  const handleProductScanned = async (productName) => {
    setScannedProduct(productName);
    console.log(productName);
    try {
      const result = await priceComparison(productName);

      setShowScanner(false);

      // Extract Amazon and Flipkart products separately
      setAmazonProduct(result.amazon || []);
      setFlipkartProduct(result.flipkart || []);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

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
      <Text className="text-territory-100 text-lg font-psemibold">
        Price Comparison
      </Text>

      {showScanner && (
        <BarcodeScanner onProductScanned={handleProductScanned} />
      )}
      <View className="flex-row justify-center items-center space-x-4">
        <SearchInput
          setQuery={setScannedProduct}
          onSearch={handleProductScanned}
          type="price"
          placeholder="Search any product..."
          textStyles={`${
            theme === "dark" ? "text-gray-100" : "text-black"
          } text-base font-pregular`}
          inputViewStyle={`w-[85%] mb-5 ${
            theme === "dark" ? "bg-primary-dark" : "bg-primary"
          } border-2 px-4 h-14 ${
            theme === "dark"
              ? "border-secondary-darkBorder"
              : "border-gray-300 "
          } rounded-2xl focus:border-secondary flex flex-row items-center`}
        />
        <TouchableOpacity onPress={() => setShowScanner(true)}>
          <Image className="w-9 h-9 mb-3" source={icons.scanner} />
        </TouchableOpacity>
      </View>

      <>
        <FlatList
          data={platforms}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            gap: 10,
            paddingHorizontal: 1,
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedPlatform(item.id)}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
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
                    : theme === "dark"
                    ? "text-primary"
                    : "text-secondary-100"
                } ${
                  selectedPlatform === item.id ? "font-pbold" : "font-pmedium"
                }`}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />

        <ItemProductList data={platformProducts[selectedPlatform] || []} />
      </>
    </ScrollView>
  );
};

export default PriceComparison;
