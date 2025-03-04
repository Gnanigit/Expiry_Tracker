import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Link, router } from "expo-router";
import TodoCard from "../../components/TodoCard";
import { useDispatch, useSelector } from "react-redux";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Navbar from "../../components/Navbar";
import { SafeAreaView } from "react-native-safe-area-context";

const todo = () => {
  const { theme } = useSelector((state) => state.theme);
  const { todos } = useSelector((state) => state.todo);

  return (
    <SafeAreaView
      className={`flex-1 h-full ${
        theme === "dark" ? "bg-primary-dark" : "bg-primary"
      }`}
    >
      <Navbar type={"todo"} />

      {todos.length === 0 ? (
        <Text>No todos available. Click + to add new.</Text>
      ) : (
        <FlatList
          className="px-3 py-3"
          data={todos}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={({ item }) => (
            <TodoCard
              key={item._id || item.name}
              name={item.name}
              weight={item.weight}
              date={new Date(item.expiryDate).toDateString()}
            />
          )}
        />
      )}

      <TouchableOpacity
        className="absolute bottom-5 right-5 bg-territory w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
        onPress={() => router.push("/create")}
      >
        <FontAwesome name="plus" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default todo;
