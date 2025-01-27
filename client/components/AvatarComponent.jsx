import React from "react";
import { View, Text } from "react-native";
import { SvgXml } from "react-native-svg";
import { Buffer } from "buffer";

const AvatarComponent = ({ avatar }) => {
  if (!avatar || !avatar.includes("data:image/svg+xml;base64,")) {
    return (
      <View>
        <Text>Invalid avatar data</Text>
      </View>
    );
  }

  try {
    const base64Data = avatar.replace("data:image/svg+xml;base64,", "");
    const decodedSvg = Buffer.from(base64Data, "base64").toString("utf-8");

    return <SvgXml xml={decodedSvg} className="w-full h-full rounded-full" />;
  } catch (error) {
    console.error("Error rendering avatar:", error);
    return (
      <View>
        <Text>Failed to load avatar</Text>
      </View>
    );
  }
};

export default AvatarComponent;
