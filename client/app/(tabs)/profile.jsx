import React, { useEffect, useState } from "react";
import { View, Text, Alert, Image, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const Profile = () => {
  return (
    <SafeAreaView className="bg-primary h-full pt-4">
      <View className="w-full items-center">
        <Text>Profile</Text>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
