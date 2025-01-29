import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, Animated } from "react-native";
import { icons } from "../constants";
import { useDispatch } from "react-redux";
import { logout } from "../routes/auth_api";
import { router } from "expo-router";
import { useSelector } from "react-redux";

const Sidebar = ({ isVisible, onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const [animation] = useState(new Animated.Value(0));
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logout(dispatch);
      setTimeout(() => {
        router.replace("/");
      }, 100);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    if (isVisible) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  if (!isVisible && animation.__getValue() === 0) return null;

  return (
    <Animated.View
      style={{
        opacity: animation,
        transform: [
          {
            translateX: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [-300, 0],
            }),
          },
        ],
      }}
      className="absolute top-10 left-0 h-full w-[60%] bg-secondary-200 z-10 px-4 pt-5"
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-row space-x-2 items.center">
          <Image
            className="w-7 h-7"
            source={icons.username}
            tintColor="#CDCDE0"
          ></Image>
          <Text className="text-lg text-territory font-pmedium text-xl text-shadow-sm">
            {user?.lastName}
          </Text>
        </View>
        <TouchableOpacity onPress={onClose} className="self-end">
          <Image
            source={icons.close}
            className="w-7 h-7"
            style={{ tintColor: "#CDCDE0" }}
          />
        </TouchableOpacity>
      </View>

      <View className=" absolute bottom-7 left-5 w-full ">
        <TouchableOpacity
          onPress={handleLogout}
          className="border-2 border-red-500 py-3 items-center flex-row  justify-center rounded-xl"
        >
          <Text className="text-red-500 text-1xl text-lg font-psemibold text-shadow-sm">
            Logout
          </Text>
          <Image
            className="w-5 h-5 ml-3"
            resizeMode="contain"
            source={icons.logout}
            style={{ tintColor: "#CDCDE0" }}
          ></Image>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default Sidebar;
