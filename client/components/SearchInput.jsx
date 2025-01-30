import { View, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useState, useRef } from "react";
import { icons } from "../constants";

const SearchInput = ({ query, setQuery }) => {
  const [input, setInput] = useState(query);
  const inputRef = useRef(null);

  return (
    <View className="w-full bg-primary-100 border-2 px-4 h-16 border-secondary-200 rounded-2xl flex flex-row items-center space-x-4 mt-2">
      <TextInput
        ref={inputRef}
        className="text-base mt-1 text-gray-300 flex-1 font-pregular"
        value={input}
        placeholder="Search your interest..."
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
    </View>
  );
};

export default SearchInput;
