import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  Image,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "../../constants";
import { router } from "expo-router";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../redux/slices/products";
import ProductCard from "../../components/ProductCard";
import { getAllProducts } from "../../routes/product_api";

const getGreeting = () => {
  const currentHour = new Date().getHours();
  if (currentHour >= 6 && currentHour < 12) {
    return { text: "Good Morning", image: icons.morning };
  } else if (currentHour >= 12 && currentHour < 17) {
    return { text: "Good Afternoon", image: icons.afternoon };
  } else if (currentHour >= 17 && currentHour < 20) {
    return { text: "Good Evening", image: icons.evening };
  } else {
    return { text: "Good Night", image: icons.night };
  }
};

const Home = () => {
  const { isLogged, user, authLoading } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.theme);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [greeting, setGreeting] = useState(getGreeting());
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(getAllProducts());
    setRefreshing(false);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 600000);
    return () => clearInterval(interval);
  }, []);

  const {
    items: products = [],
    loading,
    error,
  } = useSelector((state) => state.products);

  const backgroundColor =
    theme === "dark" ? "rgba(31, 23, 49, 1)" : "rgba(94, 53, 177, 1)";
  const boxBackgroundColor =
    theme === "dark" ? "rgba(145, 114, 205, 0.19)" : "rgba(103, 22, 254, 0.41)";
  const boxBorderColor =
    theme === "dark" ? "rgba(164, 121, 249, 0.57)" : "rgba(105, 26, 251, 0.51)";

  return (
    <SafeAreaView
      className={`flex-1 h-full ${
        theme === "dark" ? "bg-primary-dark" : "bg-primary"
      }`}
    >
      <Sidebar
        isVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
      />

      <Navbar toggleSidebar={toggleSidebar} type={"home"} />

      {/* Static Header */}
      <View
        className={`w-full px-3 ${
          theme === "dark" ? "bg-primary-dark" : "bg-primary"
        } items-center`}
      >
        <View className="w-full px-2 flex-row justify-between items-center mt-1">
          <View>
            <Text className="text-shadow-sm text-lg text-2xl font-pbold text-territory-200">
              {greeting.text + "..."}
            </Text>
            <Text
              className={`text-shadow-sm text-lg text-2xl font-psemibold ${
                theme === "dark" ? "text-secondary-darkText" : "text-secondary"
              }`}
            >
              {user?.lastName ? user?.lastName : user?.username}
            </Text>
          </View>
          <Image className="w-14 h-14" source={greeting.image} />
        </View>

        <View className="w-full flex-row justify-center gap-x-2 mt-3 min-h-[80px]">
          <TouchableOpacity
            className="flex-1  flex-row items-center rounded-2xl"
            style={{
              backgroundColor: boxBackgroundColor,
              borderWidth: 1,
              borderColor: boxBorderColor,
            }}
            onPress={() =>
              router.push({
                pathname: "/main",
                params: { component: "ComponentA", unique: Date.now() },
              })
            }
          >
            <Image
              className="w-10 h-10 object-contain ml-1"
              source={icons.addProduct}
            />
            <Text className="text-shadow-sm text-[14px] font-psemibold text-primary ml-2 max-w-[72%]">
              Add product
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 flex-row items-center rounded-2xl"
            style={{
              backgroundColor: boxBackgroundColor,
              borderWidth: 1,
              borderColor: boxBorderColor,
            }}
            onPress={() =>
              router.push({
                pathname: "/main",
                params: { component: "ComponentB", unique: Date.now() },
              })
            }
          >
            <Image
              className="w-10 h-10 object-contain ml-1 shadow-lg"
              source={icons.fake}
            />
            <Text className="text-shadow-sm text-[14px] font-psemibold  text-primary ml-2 max-w-[72%]">
              Fake Product Detection
            </Text>
          </TouchableOpacity>
        </View>

        <View className="w-full flex-row justify-center mt-3 gap-x-2  min-h-[80px] mb-5">
          <TouchableOpacity
            className="flex-1  flex-row items-center rounded-2xl"
            style={{
              backgroundColor: boxBackgroundColor,
              borderWidth: 1,
              borderColor: boxBorderColor,
            }}
            onPress={() =>
              router.push({
                pathname: "/main",
                params: { component: "ComponentC", unique: Date.now() },
              })
            }
          >
            <Image
              className="w-10 h-10 object-contain shadow-lg"
              source={icons.price}
            />
            <Text className="text-shadow-sm text-[14px] font-psemibold  text-primary ml-2 max-w-[72%]">
              Price comparison
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1  flex-row items-center rounded-2xl"
            style={{
              backgroundColor: boxBackgroundColor,
              borderWidth: 1,
              borderColor: boxBorderColor,
            }}
            onPress={() =>
              router.push({
                pathname: "/main",
                params: { component: "ComponentD", unique: Date.now() },
              })
            }
          >
            <Image
              className="w-10 h-10 object-contain ml-1 shadow-lg"
              source={icons.product}
            />
            <Text className="text-shadow-sm text-[14px] font-psemibold  text-primary ml-2 max-w-[72%]">
              Product Details
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Ready to Expire items */}
      <View
        className={`w-full h-full px-2 items-center`}
        style={{
          backgroundColor:
            theme === "dark" ? "rgba(31, 23, 49, 1)" : "rgb(255, 252, 255)",
          borderTopLeftRadius: 35,
          borderTopRightRadius: 35,
          borderTopWidth: theme === "dark" ? 3 : 2,
          borderTopColor:
            theme === "dark" ? "rgba(42, 35, 58,1)" : "rgb(235, 235, 235)",
          elevation: 15,
          flex: 1,
        }}
      >
        <View className="flex-row my-2">
          <Text className="text-lg text-shadow-sm font-pbold text-territory-100 ">
            Ready to Expire
          </Text>
          <Image className="w-6 h-6 ml-2" source={icons.expiry} />
        </View>

        {loading && <Text>Loading...</Text>}
        {error && <Text>Error: {error}</Text>}

        {!loading && products.length > 0 ? (
          <FlatList
            className=" flex-1"
            data={products.filter((item) => item.status === "red")}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <ProductCard
                image={item.prodImage}
                name={item.name}
                expDate={item.expiryDate}
                status={item.status}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              />
            )}
            contentContainerStyle={{ paddingBottom: 0 }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          !loading && (
            <Text className="text-center text-red-500 text-shadow-sm font-pregular w-full">
              No products available.
            </Text>
          )
        )}
      </View>
      <StatusBar backgroundColor={backgroundColor} style="light" />
    </SafeAreaView>
  );
};

export default Home;
