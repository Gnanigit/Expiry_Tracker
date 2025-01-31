import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar from "../../components/Navbar";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react-native";
import { icons } from "../../constants";

const Settings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState("System");

  const toggleDropdown = () => setIsOpen(!isOpen);
  const selectMode = (mode) => {
    setSelectedMode(mode);
    setIsOpen(false);
  };

  return (
    <SafeAreaView className="bg-primary flex-1">
      <Navbar type={"settings"} />
      <View className="flex-1 items-center px-3 bg-primary py-3">
        {/* Dropdown Button */}
        <TouchableOpacity
          onPress={toggleDropdown}
          className="border-2 border-gray-400 py-3 px-4 w-full flex-row justify-between items-center bg-primary-200 rounded-xl"
        >
          <View className="flex-row justify-center items-center space-x-3">
            <Image
              source={
                selectedMode == "System"
                  ? icons.system
                  : selectedMode == "Dark"
                  ? icons.dark_mode
                  : icons.light_mode
              }
              resizeMode="contain"
              className="w-6 h-6"
            />
            <Text className="text-lg font-psemibold text-territory text-shadow-sm">
              {selectedMode}
            </Text>
          </View>

          {isOpen ? (
            <ChevronUpIcon size={20} color="gray" />
          ) : (
            <ChevronDownIcon size={20} color="gray" />
          )}
        </TouchableOpacity>

        {/* Dropdown List */}
        {isOpen && (
          <View className="bg-primary-200 border-2 border-gray-400 mt-2 rounded-xl w-full">
            {["System", "Dark", "Light"].map((mode) => (
              <TouchableOpacity
                key={mode}
                onPress={() => selectMode(mode)}
                className="border-b-2 border-gray-400 py-3 px-4 w-full flex-row  items-center bg-primary-200  rounded-xl space-x-3"
              >
                <Image
                  source={
                    mode == "System"
                      ? icons.system
                      : mode == "Dark"
                      ? icons.dark_mode
                      : icons.light_mode
                  }
                  resizeMode="contain"
                  className="w-6 h-6"
                />
                <Text className="text-lg text-territory text-shadow-sm">
                  {mode}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Settings;
