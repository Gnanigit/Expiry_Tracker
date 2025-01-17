import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "../../constants";
import { router } from "expo-router";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { useLocalSearchParams } from "expo-router";
import { fetchProducts } from "../../redux/slices/products";
import ProductCard from "../../components/ProductCard";

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
  const { username } = useLocalSearchParams();
  const { isLogged, user } = useSelector((state) => state.auth);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [greeting, setGreeting] = useState(getGreeting());

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 600000);
    return () => clearInterval(interval);
  }, []);
  const dispatch = useDispatch();
  const {
    items: products = [],
    loading,
    error,
  } = useSelector((state) => state.products);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  return (
    <SafeAreaView className="bg-primary flex-1 h-full">
      <Sidebar
        isVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
      />

      <Navbar toggleSidebar={toggleSidebar} type={"home"} />

      {/* Static Header */}
      <View className="w-full px-3 bg-primary items-center">
        <View className="w-full px-2 flex-row justify-between items-center mt-1">
          <View>
            <Text className="text-shadow-sm text-lg text-2xl font-pbold text-territory-200">
              {greeting.text + "..."}
            </Text>
            <Text className="text-shadow-sm text-lg text-2xl font-psemibold text-secondary-100">
              {user.username ? user.username : username}
            </Text>
          </View>
          <Image className="w-14 h-14" source={greeting.image} />
        </View>

        <View className="w-full flex-row justify-center gap-x-2 mt-3 min-h-[80px]">
          <TouchableOpacity
            className="flex-1 bg-secondary-300 flex-row items-center rounded-2xl"
            onPress={() =>
              router.push({
                pathname: "/main",
                params: { component: "ComponentA" },
              })
            }
          >
            <Image
              className="w-12 h-12 object-contain ml-1"
              source={icons.cart}
            />
            <Text className="text-shadow-sm text-[15px] font-psemibold text-white ml-1 max-w-[75%]">
              Add product
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-secondary-300 flex-row items-center rounded-2xl">
            <Image
              className="w-12 h-12 object-contain ml-1 shadow-lg"
              source={icons.fake}
            />
            <Text className="text-shadow-sm text-[15px] font-psemibold  text-white ml-1 max-w-[75%]">
              Fake Product Detection
            </Text>
          </TouchableOpacity>
        </View>

        <View className="w-full flex-row justify-center mt-3 gap-x-2  min-h-[80px] mb-5">
          <TouchableOpacity className="flex-1 bg-secondary-300 flex-row items-center rounded-2xl">
            <Image
              className="w-12 h-12 object-contain shadow-lg"
              source={icons.price}
            />
            <Text className="text-shadow-sm text-[15px] font-psemibold  text-white ml-1 max-w-[75%]">
              Price comparison
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-secondary-300 flex-row items-center rounded-2xl">
            <Image
              className="w-12 h-12 object-contain ml-1 shadow-lg"
              source={icons.product}
            />
            <Text className="text-shadow-sm text-[15px] font-psemibold  text-white max-w-[75%]">
              Product Details
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        className="w-full h-full bg-secondary-100 py-5 px-1 items-center"
        style={{
          borderTopLeftRadius: 35,
          borderTopRightRadius: 35,
          elevation: 7,
          flex: 1,
        }}
      >
        <Text className="text-lg text-shadow-sm font-pbold text-territory-100 ">
          Ready to Expire
        </Text>

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
              />
            )}
            contentContainerStyle={{ paddingBottom: 0 }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          !loading && <Text>No products available.</Text>
        )}
      </View>

      <StatusBar backgroundColor="#5E35B1" style="light" />
    </SafeAreaView>
  );
};

export default Home;
