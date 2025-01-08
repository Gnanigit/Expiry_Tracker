import React, { useState } from "react";
import { View, Text, Alert, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import CustomButton from "../../components/CustomButton";
import { getBarcodeNumber } from "../../routes/api";

const Home = () => {
  const [imageUri, setImageUri] = useState(null);
  const [code, setCode] = useState("");

  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Denied", "We need access to your gallery.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick an image.");
    }
  };

  const submit = async () => {
    if (!imageUri) {
      Alert.alert("No Image", "Please select an image first.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        type: "image/jpeg",
        name: "barcode.jpg",
      });
      const result = await getBarcodeNumber(formData);
      setCode(result);
      Alert.alert("Result", result);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full pt-4">
      <View className="w-full items-center">
        <Text>This is Home</Text>
        <CustomButton
          title="Pick Image"
          handlePress={pickImage}
          containerStyles="w-[50%] rounded-[50px] min-h-[55px] mb-4"
        />
        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={{ width: 200, height: 200, marginBottom: 20 }}
          />
        )}

        <CustomButton
          title="Get Code"
          handlePress={submit}
          containerStyles="w-[50%] rounded-[50px] min-h-[55px]"
        />

        <Text>{code}</Text>
      </View>
    </SafeAreaView>
  );
};

export default Home;
