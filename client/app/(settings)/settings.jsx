import { View, Text, TouchableOpacity, Image, Appearance } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../../redux/slices/theme";
import Navbar from "../../components/Navbar";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react-native";
import { icons } from "../../constants";

const Settings = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectMode = (mode) => {
    if (mode === "system") {
      const systemTheme = Appearance.getColorScheme();

      dispatch(setTheme(systemTheme));
      setIsOpen(false);
    } else {
      dispatch(setTheme(mode));
    }

    dispatch(setTheme(mode));
    setIsOpen(false);
  };
  return (
    <SafeAreaView
      className={`flex-1 ${
        theme === "dark" ? "bg-primary-dark" : "bg-primary"
      }`}
    >
      <Navbar type={"settings"} />
      <View className="flex-1 items-center px-3 py-3">
        {/* Dropdown Button */}
        <TouchableOpacity
          onPress={toggleDropdown}
          className={`${
            theme === "dark" ? "bg-primary-dark" : "bg-primary"
          } border-2 py-3 px-4 w-full flex-row justify-between items-center ${
            theme === "dark" ? "border-secondary" : "border-gray-300 "
          } rounded-xl`}
        >
          <View className="flex-row justify-center items-center space-x-3">
            <Image
              source={
                theme === "system"
                  ? icons.system
                  : theme === "dark"
                  ? icons.dark_mode
                  : icons.light_mode
              }
              resizeMode="contain"
              className="w-6 h-6"
            />
            <Text className="text-lg font-psemibold text-territory ">
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
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
          <View
            className={`${
              theme === "dark" ? "bg-primary-dark" : "bg-primary"
            } border-2 ${
              theme === "dark" ? "border-secondary" : "border-gray-300 "
            } mt-2 rounded-xl w-full`}
          >
            {["system", "dark", "light"].map((mode) => (
              <TouchableOpacity
                key={mode}
                onPress={() => selectMode(mode)}
                className={`border-b-2 ${
                  theme === "dark" ? "border-secondary" : "border-gray-300 "
                } py-3 px-4 w-full flex-row items-center rounded-xl space-x-3`}
              >
                <Image
                  source={
                    mode == "system"
                      ? icons.system
                      : mode == "dark"
                      ? icons.dark_mode
                      : icons.light_mode
                  }
                  resizeMode="contain"
                  className="w-6 h-6"
                />
                <Text className="text-lg text-territory dark:text-white">
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
