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
      className={`${theme === "dark" ? "bg-black" : "bg-primary"} h-full mt-8`}
    >
      <Navbar type="search" />

      <ScrollView className="px-3" keyboardShouldPersistTaps="handled">
        <View className="my-2">
          <SearchInput query={query} setQuery={setQuery} />
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
