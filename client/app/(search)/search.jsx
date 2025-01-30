import {
  View,
  Text,
  Image,
  SafeAreaView,
  FlatList,
  RefreshControl,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
// import { searchPosts } from "../../routes/product_api";
import { useLocalSearchParams } from "expo-router";
//   import useFetch from "../../hooks/useFetch";
import ProductCard from "../../components/ProductCard";
import Navbar from "../../components/Navbar";

const Search = () => {
  const params = useLocalSearchParams();
  const query = params?.query || ""; // Ensure query exists

  // const { data: posts, refetch } = useFetch(() => searchPosts(query));

  // useEffect(() => {
  //   if (query) {
  //     refetch();
  //   }
  // }, [query]);

  return (
    <SafeAreaView className="bg-primary h-full pt-7">
      <Navbar type={"search"} />
      <FlatList
        data={[]}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-2 px-4 ">
            {/* <Text className="font-pmedium text-gray-100 text-sm">
              Search Results
            </Text> */}
            {/* <Text className="text-2xl font-psemibold text-white">{query}</Text> */}
            <View className="m-0 p-0">
              <SearchInput title="Search" initialQuery={query} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Products found"
            subtitle="No product found for this search query."
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
