import { View, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useState, useRef } from "react";
import { icons } from "../constants";

const SearchInput = ({
  query,
  setQuery,
  inputViewStyle,
  textStyles,
  placeholder,
  type,
  onSearch,
}) => {
  const [input, setInput] = useState(query);
  const inputRef = useRef(null);

  //for pricing comparison
  const [priceInput, setPriceInput] = useState(query);
  const inputPriceRef = useRef(null);
  const handleSearch = () => {
    if (
      priceInput &&
      typeof priceInput === "string" &&
      priceInput.trim() !== ""
    ) {
      setQuery(priceInput.trim());
      onSearch(priceInput.trim());
    } else {
      console.log("Invalid input: Search term is empty or undefined.");
    }
  };

  return (
    <View className={`${inputViewStyle} space-x-4 mt-2 `}>
      {type === "price" ? (
        <>
          <TextInput
            ref={inputPriceRef}
            className={`mt-1 text-gray-300 flex-1  ${textStyles}`}
            value={input}
            placeholderTextColor="#7b7b8b"
            placeholder={placeholder}
            onChangeText={(text) => setPriceInput(text)}
            onFocus={() => inputPriceRef.current?.focus()}
          />
          <TouchableOpacity onPress={handleSearch}>
            <Image
              className="w-5 h-5"
              resizeMode="contain"
              source={icons.search}
              style={{ tintColor: "#CDCDE0" }}
            />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            ref={inputRef}
            className={`mt-1 text-gray-300 flex-1  ${textStyles}`}
            value={input}
            placeholderTextColor="#7b7b8b"
            placeholder={placeholder}
            onChangeText={(text) => {
              setInput(text);
              setQuery(text);
            }}
            onFocus={() => inputRef.current?.focus()}
          />
          <TouchableOpacity onPress={() => inputRef.current?.focus()}>
            <Image
              className="w-5 h-5"
              resizeMode="contain"
              source={icons.search}
              style={{ tintColor: "#CDCDE0" }}
            />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default SearchInput;
