import { View, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useState, useRef } from "react";
import { icons } from "../constants";

const SearchInput = ({ query, setQuery, inputViewStyle, textStyles }) => {
  const [input, setInput] = useState(query);
  const inputRef = useRef(null);

  return (
    <View className={`${inputViewStyle} space-x-4 mt-2 `}>
      <TextInput
        ref={inputRef}
        className={`mt-1 text-gray-300 flex-1  ${textStyles}`}
        value={input}
        placeholderTextColor="#7b7b8b"
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
