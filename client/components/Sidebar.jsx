import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, Animated } from "react-native";
import { icons } from "../constants";

const Sidebar = ({ isVisible, onClose }) => {
  const [animation] = useState(new Animated.Value(0));

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
      className="absolute top-10 left-0 h-full w-[45%] bg-secondary-200 z-10 px-5 pt-10"
    >
      <TouchableOpacity onPress={onClose} className="self-end">
        <Image source={icons.close} className="w-6 h-6 tint-white" />
      </TouchableOpacity>

      <Text className="text-territory-100 font-psemibold text-lg ">
        Sidebar Content
      </Text>
    </Animated.View>
  );
};

export default Sidebar;
