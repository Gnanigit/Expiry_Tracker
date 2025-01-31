import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { icons } from "../constants";

export default function MainComponents() {
  const [visible, setVisible] = useState(false);
  const [isFullyVisible, setIsFullyVisible] = useState(false);
  const position = useSharedValue(0);
  const opacity = useSharedValue(0);

  const toggleBoxes = () => {
    if (visible) {
      setIsFullyVisible(false);
    }
    setVisible(!visible);

    position.value = visible ? 0 : 100;
    opacity.value = withTiming(
      visible ? 0 : 1,
      {
        duration: 300,
      },
      () => {
        if (!visible) runOnJS(setIsFullyVisible)(true);
      }
    );
  };

  const getBoxStyle = (xMultiplier, yMultiplier) =>
    useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [
        {
          translateX: withTiming(xMultiplier * position.value, {
            duration: 300,
          }),
        },
        {
          translateY: withTiming(1.2 * yMultiplier * position.value, {
            duration: 300,
          }),
        },
      ],
    }));

  const boxStyle =
    "h-[80px] w-[180px] bg-secondary-300 flex-row items-center rounded-2xl px-3";

  return (
    <View className="items-center ">
      {/* Central Circle */}
      <TouchableOpacity
        className="h-24 w-24 rounded-full bg-territory-100 items-center justify-center z-10 "
        style={{
          elevation: 3,
        }}
        onPress={toggleBoxes}
      >
        <Text className="text-white font-psemibold text-lg">TAP</Text>
      </TouchableOpacity>

      {/* ------------ONE----------- */}
      <Animated.View style={getBoxStyle(-1, -1)} className="absolute">
        <TouchableOpacity
          className={boxStyle}
          onPress={() =>
            router.push({
              pathname: "/main",
              params: { component: "ComponentA", unique: Date.now() },
            })
          }
          style={{
            elevation: isFullyVisible ? 7 : 0,
          }}
        >
          <Image
            className="w-12 h-12 object-contain ml-1"
            source={icons.cart}
          />
          <Text className="text-shadow-sm text-[15px] font-psemibold text-white ml-1 max-w-[75%]">
            Add product
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* ------------TWO----------- */}
      <Animated.View style={getBoxStyle(1, -1)} className="absolute">
        <TouchableOpacity
          className={boxStyle}
          style={{
            elevation: isFullyVisible ? 7 : 0,
          }}
          onPress={() =>
            router.push({
              pathname: "/main",
              params: { component: "ComponentB", unique: Date.now() },
            })
          }
        >
          <Image
            className="w-12 h-12 object-contain ml-1 shadow-lg"
            source={icons.fake}
          />
          <Text className="text-shadow-sm text-[15px] font-psemibold text-white ml-1 max-w-[75%]">
            Fake Product Detection
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* ------------THREE----------- */}
      <Animated.View style={getBoxStyle(-1, 1)} className="absolute">
        <TouchableOpacity
          className={boxStyle}
          style={{
            elevation: isFullyVisible ? 7 : 0,
          }}
        >
          <Image
            className="w-12 h-12 object-contain shadow-lg"
            source={icons.price}
          />
          <Text className="text-shadow-sm text-[15px] font-psemibold text-white ml-1 max-w-[75%]">
            Price comparison
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* ------------FOUR----------- */}
      <Animated.View style={getBoxStyle(1, 1)} className="absolute">
        <TouchableOpacity
          className={boxStyle}
          style={{
            elevation: isFullyVisible ? 7 : 0,
          }}
        >
          <Image
            className="w-12 h-12 object-contain ml-1 shadow-lg"
            source={icons.product}
          />
          <Text className="text-shadow-sm text-[15px] font-psemibold text-white ml-1 max-w-[75%]">
            Product Details
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
