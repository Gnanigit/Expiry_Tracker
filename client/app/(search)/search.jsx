import { View, SafeAreaView, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import { searchProducts } from "../../routes/product_api";
import useFetch from "../../hooks/useFetch";
import ProductCard from "../../components/ProductCard";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";

const Search = () => {
  const [query, setQuery] = useState("");
  const { theme } = useSelector((state) => state.theme);

  const { data: products, refetch } = useFetch(
    () => searchProducts(query),
    false
  );

  useEffect(() => {
    if (query.trim().length > 0) {
      refetch();
    }
  }, [query]);

  return (
    <SafeAreaView
      className={`${
        theme === "dark" ? "bg-primary-dark" : "bg-primary"
      } h-full mt-8`}
    >
      <Navbar type="search" />

      <ScrollView className="px-3" keyboardShouldPersistTaps="handled">
        <View className="my-2">
          <SearchInput
            query={query}
            setQuery={setQuery}
            placeholder="Search your products..."
            textStyles={`${
              theme === "dark" ? "text-gray-100" : "text-black"
            } text-base font-pregular`}
            inputViewStyle={`w-full ${
              theme === "dark" ? "bg-primary-dark" : "bg-primary"
            } border-2 px-4 h-16 ${
              theme === "dark"
                ? "border-secondary-darkBorder"
                : "border-gray-300 "
            } rounded-2xl focus:border-secondary flex flex-row items-center`}
          />
        </View>

        {query.trim().length > 0 ? (
          products?.length > 0 ? (
            products.map((item) => (
              <ProductCard
                key={item._id}
                image={item.prodImage}
                name={item.name}
                expDate={item.expiryDate}
                status={item.status}
              />
            ))
          ) : (
            <EmptyState
              title="No Products found"
              subtitle="No product found for this search query."
            />
          )
        ) : (
          <EmptyState
            title="No Products found"
            subtitle="No product found for this search query."
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Search;
