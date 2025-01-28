import React from "react";
import { View, Text, Image } from "react-native";
import { SvgXml } from "react-native-svg";
import { Buffer } from "buffer";

const AvatarComponent = ({ avatar, resizeMode = "contain" }) => {
  if (avatar && avatar.includes("data:image/svg+xml;base64,")) {
    try {
      const base64Data = avatar.replace("data:image/svg+xml;base64,", "");
      let decodedSvg = Buffer.from(base64Data, "base64").toString("utf-8");

      decodedSvg = decodedSvg.replace(/fill="[^"]*"/g, 'fill="currentColor"');
      decodedSvg = decodedSvg.replace(
        /stroke="[^"]*"/g,
        'stroke="currentColor"'
      );

      return (
        <View className="w-full h-full">
          <SvgXml
            xml={decodedSvg}
            style={{
              color: "rgb(255, 210, 147)",
              width: "100%",
              height: "100%",
              resizeMode,
            }}
          />
        </View>
      );
    } catch (error) {
      console.error("Error rendering avatar:", error);
      return (
        <View>
          <Text>Failed to load avatar</Text>
        </View>
      );
    }
  }

  // Handle image URLs (PNG, JPG, etc.)
  if (
    (avatar &&
      (avatar.startsWith("http://") ||
        avatar.startsWith("https://") ||
        avatar.startsWith("data:image/"))) ||
    avatar.startsWith("file://") ||
    avatar.startsWith("asset-library://") ||
    avatar.startsWith("content://") ||
    avatar.startsWith("cdvfile://") ||
    avatar.startsWith("cdvfile://localhost")
  ) {
    return (
      <View className="w-full h-full rounded-full">
        <Image
          className="w-full h-full rounded-full"
          source={{ uri: avatar }}
          style={{
            resizeMode: resizeMode || "contain",
          }}
        />
      </View>
    );
  }

  return (
    <View className="w-full h-full justify-center items-center bg-gray-300 rounded-full">
      <Text className="text-center text-white">No Avatar</Text>
    </View>
  );
};

export default AvatarComponent;
