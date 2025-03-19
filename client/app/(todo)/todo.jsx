import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router } from "expo-router";
import TodoCard from "../../components/TodoCard";
import { useDispatch, useSelector } from "react-redux";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Navbar from "../../components/Navbar";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "../../constants";
import { removeTodos } from "../../redux/slices/todo";
import { deleteTodo } from "../../routes/todo_api";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";

const TodoScreen = () => {
  const { theme } = useSelector((state) => state.theme);
  const { todos } = useSelector((state) => state.todo);
  const [selectedTodos, setSelectedTodos] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false); // NEW state for hiding header
  const dispatch = useDispatch();
  const listRef = useRef(null);

  const handleLongPress = (id) => {
    if (!selectionMode) {
      setSelectionMode(true);
      setSelectedTodos([id]);
    }
  };

  const shareTodos = async () => {
    try {
      setIsCapturing(true); // Show heading before capturing

      setTimeout(async () => {
        const uri = await captureRef(listRef, {
          format: "png",
          quality: 1,
        });

        setIsCapturing(false); // Hide heading after capturing
        await Sharing.shareAsync(uri);
      }, 500);
    } catch (error) {
      setIsCapturing(false);
      Alert.alert("Error", "Failed to share the list. Please try again.");
      console.error(error);
    }
  };

  const handleTap = (id) => {
    if (selectionMode) {
      const updatedSelection = selectedTodos.includes(id)
        ? selectedTodos.filter((todoId) => todoId !== id)
        : [...selectedTodos, id];

      setSelectedTodos(updatedSelection);
      if (updatedSelection.length === 0) {
        setSelectionMode(false);
      }
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Confirmation", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await deleteTodo(selectedTodos);
            dispatch(removeTodos(selectedTodos));
            setSelectedTodos([]);
            setSelectionMode(false);
          } catch (error) {
            Alert.alert("Error", "Failed to delete todos. Please try again.");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView
      className={`flex-1 h-full ${
        theme === "dark" ? "bg-primary-dark" : "bg-primary"
      }`}
    >
      <Navbar type="todo" />

      <View className="h-10 flex-row justify-end items-center px-4">
        <TouchableOpacity
          onPress={handleDelete}
          disabled={selectedTodos.length === 0}
          className={`rounded-lg flex-row items-center justify-center py-1`}
        >
          <FontAwesome
            name="trash"
            size={20}
            color={selectedTodos.length > 0 ? "red" : "gray"}
          />
          <Text
            className={`ml-2 ${
              selectedTodos.length > 0
                ? "text-red-500 text-[15px]"
                : "text-gray-500 text-[15px]"
            }`}
          >
            Delete Selected
          </Text>
        </TouchableOpacity>
      </View>

      {/* List with hidden heading when sharing */}
      <View
        ref={listRef}
        collapsable={false}
        className={`px-3 ${
          theme === "dark" ? "bg-primary-dark" : "bg-primary"
        }`}
      >
        {/* Conditionally Render Heading Only While Sharing */}
        {isCapturing && (
          <Text
            className={`text-shadow-md text-2xl text-center font-pextrabold mb-2 ${
              theme === "dark"
                ? "text-secondary-darkText"
                : "text-secondary-100"
            }`}
          >
            My Grocery List
          </Text>
        )}

        {todos.length === 0 ? (
          <Text className="text-center mt-5">
            No todos available. Long-press to select.
          </Text>
        ) : (
          <FlatList
            data={todos}
            keyExtractor={(item) => item._id || item.name}
            renderItem={({ item }) => (
              <TodoCard
                key={item._id || item.name}
                name={item.name}
                weight={item.weight}
                date={new Date(item.expiryDate).toDateString()}
                isSelected={selectedTodos.includes(item._id)}
                onLongPress={() => handleLongPress(item._id)}
                onPress={() => handleTap(item._id)}
              />
            )}
          />
        )}
      </View>

      {/* Share Button */}
      <TouchableOpacity
        className="absolute bottom-5 right-20 bg-blue-500 w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
        onPress={shareTodos}
      >
        <FontAwesome name="share-alt" size={24} color="white" />
      </TouchableOpacity>

      {/* Floating Add Button */}
      <TouchableOpacity
        className="absolute bottom-5 right-5 bg-territory w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
        onPress={() => router.push("/create")}
      >
        <Image
          source={icons.create}
          className="w-8 h-8"
          style={{ tintColor: "#ffffff" }}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default TodoScreen;
